// Regression: whole-portal role boundaries, money transitions and document privacy.
// Found by /qa on 2026-10-12.
// Report: .gstack/qa-reports/full-portal-20261012/report.md
import request from 'supertest';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/database';
import app from '../src/app';
import { performanceMetricKeys } from '../src/modules/performance/performance.schema';
import fs from 'fs';
import path from 'path';
import { uploadsDirectory } from '../src/config/storage';

jest.mock('../src/utils/notification.dispatcher', () => ({ notificationDispatcher: { dispatch: jest.fn().mockResolvedValue(undefined) } }));
const db = new URL(process.env.DATABASE_URL || 'postgresql://localhost/disabled');
const suite = ['localhost', '127.0.0.1'].includes(db.hostname) && db.pathname.startsWith('/hr_recruitment_qa_') ? describe : describe.skip;

suite('Portal readiness: role boundaries and complete module journeys', () => {
  jest.setTimeout(30000);
  const tokens: Record<string, string> = {};
  const employeeIds: Record<string, string> = {};
  const userIds: Record<string, string> = {};
  const call = (role: string, method: 'get'|'post'|'put'|'patch'|'delete', path: string, body?: any) => {
    const test = request(app)[method]('/api' + path).set('Authorization', `Bearer ${tokens[role]}`);
    return body === undefined ? test : test.send(body);
  };
  const succeeds = (res: any) => { expect({ status: res.status, body: res.body }).toEqual(expect.objectContaining({ status: expect.any(Number) })); expect(res.status).toBeLessThan(300); expect(res.status).toBeGreaterThanOrEqual(200); return res.body.data; };
  beforeAll(async () => {
    const department = await prisma.department.upsert({where:{name:'Portal QA'},update:{},create:{name:'Portal QA'}});
    for (const role of ['ADMIN','HR','MANAGER','EMPLOYEE','OTHER'] as const) {
      const email = `${role.toLowerCase()}@portal-qa.test`;
      const employee = await prisma.employee.upsert({where:{email},update:{},create:{email,employeeCode:`PORTAL-QA-${role}`,firstName:'Portal QA',lastName:role,designation:role,joiningDate:new Date('2026-01-01'),departmentId:department.id}});
      const user = await prisma.user.upsert({where:{email},update:{role:role==='OTHER'?'EMPLOYEE':role,password:await bcrypt.hash('Portal-QA-only-20261012',4),isActive:true},create:{email,employeeId:employee.id,role:role==='OTHER'?'EMPLOYEE':role,password:await bcrypt.hash('Portal-QA-only-20261012',4)}});
      employeeIds[role]=employee.id; userIds[role]=user.id;
      const login = await request(app).post('/api/auth/login').send({email,password:'Portal-QA-only-20261012'});
      tokens[role]=succeeds(login).token;
    }
    await prisma.employee.update({where:{id:employeeIds.EMPLOYEE},data:{managerId:employeeIds.MANAGER}});
    await prisma.travelRequest.deleteMany({where:{employeeId:{in:Object.values(employeeIds)}}});
    await prisma.leave.deleteMany({where:{employeeId:{in:Object.values(employeeIds)}}});
  });
  afterAll(async()=>{await prisma.$disconnect();});

  for (const role of ['ADMIN','HR','MANAGER','EMPLOYEE']) {
    it(`${role} can load every permitted module without a server error`, async()=>{
      const shared=['/auth/me','/dashboard/stats','/employees','/departments','/travel','/office-expenses','/assets','/performance/my-reviews','/training/my-trainings','/training/dashboard','/requests/my-requests','/policies','/policies/my-acknowledgements','/notifications','/notifications/unread-count'];
      for(const path of shared) { const res=await call(role,'get',path); expect({path,status:res.status,body:res.body}).toMatchObject({status:200}); }
      const staff=['/recruitment/requisitions','/recruitment/interviews','/performance','/training','/requests','/audit','/login-history'];
      for(const path of staff) {const res=await call(role,'get',path); expect({path,status:res.status}).toMatchObject({status:role==='EMPLOYEE'?403:200});}
      expect((await call(role,'get','/leaves/my-leaves')).status).toBe(role==='MANAGER'?403:200);
    });
  }
  it('rejects unauthenticated access and invalid credentials',async()=>{
    expect((await request(app).get('/api/employees')).status).toBe(401);
    expect((await request(app).post('/api/auth/login').send({email:'employee@portal-qa.test',password:'incorrect'})).status).toBe(401);
  });
  it('readiness fails for missing workflow schema and maintenance routes stay disabled outside development',async()=>{
    const probe=jest.spyOn(prisma.candidate,'findFirst').mockRejectedValueOnce(new Error('missing column'));
    try { expect((await request(app).get('/api/ready')).status).toBe(503); } finally { probe.mockRestore(); }
    expect((await request(app).get('/api/ready')).status).toBe(200);
    for(const route of ['fix-users','reactivate-and-fix','clear-history']) {
      expect((await call('ADMIN','post',`/employees/${route}`,{})).status).toBe(404);
    }
    const denied=await request(app).get('/api/live').set('Origin','https://untrusted-origin.test');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
  it('reading employee profiles does not emit joining notifications or expose reviewer ratings to employees',async()=>{
    const review=await prisma.performanceReview.create({data:{employeeId:employeeIds.EMPLOYEE,reviewPeriod:'MONTHLY',status:'MANAGER_REVIEW',selfRating:5,hrRating:3,hrComments:'Private interim HR',managerRating:4,managerComments:'Private manager'}});
    const before=await prisma.notification.count({where:{notificationType:'JOINING',triggerEvent:employeeIds.EMPLOYEE}});
    succeeds(await call('ADMIN','get',`/employees/${employeeIds.EMPLOYEE}`));
    const profile=succeeds(await call('EMPLOYEE','get',`/employees/${employeeIds.EMPLOYEE}`));
    expect(await prisma.notification.count({where:{notificationType:'JOINING',triggerEvent:employeeIds.EMPLOYEE}})).toBe(before);
    const visible=profile.performanceReviews.find((r:any)=>r.id===review.id);
    expect(visible).not.toHaveProperty('managerRating'); expect(visible).not.toHaveProperty('managerComments');
    expect(visible.hrComments).toBeNull(); expect(visible.finalRating).toBeNull();
  });
  it('manager dashboard includes assigned manager reviews and excludes another managers reviews',async()=>{
    await prisma.performanceReview.create({data:{employeeId:employeeIds.EMPLOYEE,reviewPeriod:'MONTHLY',status:'MANAGER_REVIEW'}});
    const unrelated=await prisma.performanceReview.create({data:{employeeId:employeeIds.OTHER,reviewPeriod:'MONTHLY',status:'MANAGER_REVIEW'}});
    const dashboard=succeeds(await call('MANAGER','get','/dashboard/stats'));
    const assigned=await prisma.performanceReview.findMany({where:{status:{in:['MANAGER_REVIEW','FINAL_APPROVAL']},employee:{managerId:employeeIds.MANAGER}},select:{id:true}});
    expect(dashboard.needsAttention.some((item:any)=>assigned.some(r=>item.id===`perf-${r.id}`))).toBe(true);
    expect(dashboard.needsAttention.some((item:any)=>item.id===`perf-${unrelated.id}`)).toBe(false);
  });
  it('manager dashboard retains assigned reviews waiting for configured final approval',async()=>{
    await prisma.performanceReview.updateMany({where:{employeeId:employeeIds.EMPLOYEE,status:'MANAGER_REVIEW'},data:{status:'FINAL_APPROVAL'}});
    await prisma.performanceReview.create({data:{employeeId:employeeIds.EMPLOYEE,reviewPeriod:'MONTHLY',status:'FINAL_APPROVAL'}});
    const assigned=await prisma.performanceReview.findMany({where:{employeeId:employeeIds.EMPLOYEE,status:'FINAL_APPROVAL'},select:{id:true}});
    const dashboard=succeeds(await call('MANAGER','get','/dashboard/stats'));
    expect(dashboard.needsAttention.some((item:any)=>assigned.some(r=>item.id===`perf-${r.id}`))).toBe(true);
  });
  it('charges leave balance once when approvals race',async()=>{
    const year=2031;
    await prisma.leaveBalance.upsert({where:{employeeId_year_leaveType:{employeeId:employeeIds.EMPLOYEE,year,leaveType:'CASUAL'}},update:{totalDays:10,usedDays:0,remainingDays:10},create:{employeeId:employeeIds.EMPLOYEE,year,leaveType:'CASUAL',totalDays:10,usedDays:0,remainingDays:10}});
    const leave=await prisma.leave.create({data:{employeeId:employeeIds.EMPLOYEE,leaveType:'CASUAL',startDate:new Date('2031-03-03'),endDate:new Date('2031-03-03'),totalDays:1,reason:'Concurrent approval QA'}});
    const results=await Promise.all([call('HR','patch',`/leaves/${leave.id}/status`,{status:'APPROVED'}),call('ADMIN','patch',`/leaves/${leave.id}/status`,{status:'APPROVED'})]);
    expect(results.filter(r=>r.status===200)).toHaveLength(1);
    const balance=await prisma.leaveBalance.findUniqueOrThrow({where:{employeeId_year_leaveType:{employeeId:employeeIds.EMPLOYEE,year,leaveType:'CASUAL'}}});
    expect(balance.usedDays.toNumber()).toBe(1); expect(balance.remainingDays.toNumber()).toBe(9);
  });
  it('protects receipt downloads with authentication, ownership and module permissions',async()=>{
    const filename=`qa-private-${Date.now()}.pdf`;
    const url=`/api/uploads/${filename}`;
    fs.writeFileSync(path.join(uploadsDirectory,filename),'Synthetic receipt');
    try {
      await prisma.travelRequest.create({data:{employeeId:employeeIds.EMPLOYEE,travelPurpose:'Private receipt QA',destination:'QA',startDate:new Date('2032-01-05'),endDate:new Date('2032-01-05'),travelMode:'ROAD',billUpload:url}});
      expect((await request(app).get(url)).status).toBe(403);
      expect((await request(app).get(`/api/upload/files/travel/${filename}`)).status).toBe(401);
      expect((await call('OTHER','get',`/upload/files/travel/${filename}`)).status).toBe(404);
      expect((await call('EMPLOYEE','get',`/upload/files/expenses/${filename}`)).status).toBe(404);
      expect((await call('EMPLOYEE','get',`/upload/files/travel/${filename}`)).status).toBe(200);
      expect((await call('HR','get',`/upload/files/travel/${filename}`)).status).toBe(200);
    } finally { fs.unlinkSync(path.join(uploadsDirectory,filename)); }
  });
  it('supports travel creation, approval, own expense submission and settlement with numeric totals',async()=>{
    const travel=succeeds(await call('EMPLOYEE','post','/travel',{travelPurpose:'Synthetic QA journey',destination:'QA Office',startDate:'2030-01-07',endDate:'2030-01-08',travelMode:'TRAIN',advanceRequested:100}));
    expect((await call('OTHER','get',`/travel/${travel.id}`)).status).toBe(404);
    const approved=succeeds(await call('HR','put',`/travel/${travel.id}/approve`,{approvalStatus:'APPROVED',advanceApproved:100}));
    expect(approved.approverId).toBe(employeeIds.HR);
    succeeds(await call('EMPLOYEE','put',`/travel/${travel.id}/expenses`,{hotelExpense:100.1,foodAllowance:50.2,localConveyance:30,otherExpenses:20}));
    const settled=succeeds(await call('ADMIN','put',`/travel/${travel.id}/settle`,{}));
    expect(Number(settled.totalExpenseClaimed)).toBe(200.3); expect(Number(settled.amountPayable)).toBe(100.3);
    expect(settled.verifiedById).toBe(userIds.ADMIN);
    expect((await call('EMPLOYEE','put',`/travel/${travel.id}/expenses`,{hotelExpense:1,foodAllowance:1,localConveyance:1,otherExpenses:1})).status).toBeGreaterThanOrEqual(400);
  });
  it('prevents settling travel before approval',async()=>{
    const travel=succeeds(await call('OTHER','post','/travel',{travelPurpose:'Pending QA',destination:'QA',startDate:'2030-02-04',endDate:'2030-02-05',travelMode:'ROAD'}));
    expect((await call('HR','put',`/travel/${travel.id}/settle`,{hotelExpense:100})).status).toBe(400);
  });
  it('supports office expense approval and payment, rejecting payment before approval',async()=>{
    const expense=succeeds(await call('EMPLOYEE','post','/office-expenses',{expenseDate:'2030-01-07',category:'STATIONERY',description:'Synthetic office expense',amount:150}));
    expect((await call('HR','patch',`/office-expenses/${expense.id}/status`,{status:'PAID'})).status).toBeGreaterThanOrEqual(400);
    succeeds(await call('HR','patch',`/office-expenses/${expense.id}/status`,{status:'APPROVED'}));
    succeeds(await call('ADMIN','patch',`/office-expenses/${expense.id}/status`,{status:'PAID'}));
    expect((await call('EMPLOYEE','patch',`/office-expenses/${expense.id}/status`,{status:'REJECTED'})).status).toBe(403);
  });
  it('supports employee leave application, HR approval and rejects overlapping dates',async()=>{
    const leave=succeeds(await call('EMPLOYEE','post','/leaves/apply',{leaveType:'UNPAID',startDate:'2030-03-04',endDate:'2030-03-05',reason:'Synthetic leave QA'}));
    expect(leave.startDate.slice(0,10)).toBe('2030-03-04'); expect(leave.endDate.slice(0,10)).toBe('2030-03-05');
    expect((await call('EMPLOYEE','post','/leaves/apply',{leaveType:'UNPAID',startDate:'2030-03-04',endDate:'2030-03-05',reason:'Overlap'})).status).toBe(400);
    succeeds(await call('HR','patch',`/leaves/${leave.id}/status`,{status:'APPROVED'}));
    expect((await call('EMPLOYEE','patch',`/leaves/${leave.id}/status`,{status:'REJECTED'})).status).toBe(403);
  });
  it('supports training enrolment, attendance and private participant feedback',async()=>{
    const training=succeeds(await call('HR','post','/training',{trainingTopic:'Synthetic safety training',trainingType:'INTERNAL',trainingDate:'2030-04-01',trainerName:'QA Trainer'}));
    succeeds(await call('HR','post',`/training/${training.id}/participants`,{employeeId:employeeIds.EMPLOYEE}));
    succeeds(await call('EMPLOYEE','put',`/training/${training.id}/participants/${employeeIds.EMPLOYEE}/feedback`,{feedbackRating:4,feedbackComments:'QA feedback'}));
    expect((await call('OTHER','put',`/training/${training.id}/participants/${employeeIds.EMPLOYEE}/feedback`,{feedbackRating:1})).status).toBeGreaterThanOrEqual(400);
    succeeds(await call('HR','put',`/training/${training.id}/participants/${employeeIds.EMPLOYEE}/assessment`,{attendanceStatus:'TRAINING_PRESENT',assessmentScore:85,certificateIssued:true}));
  });
  it('supports employee HR requests through assignment and resolution',async()=>{
    const ticket=succeeds(await call('EMPLOYEE','post','/requests',{requestType:'HR_QUERY',description:'Synthetic QA ticket'}));
    succeeds(await call('HR','put',`/requests/${ticket.id}/assign`,{assignedToId:userIds.HR}));
    succeeds(await call('HR','put',`/requests/${ticket.id}/status`,{status:'RESOLVED',responseNotes:'Synthetic resolution'}));
    expect((await call('OTHER','put',`/requests/${ticket.id}/status`,{status:'TICKET_CLOSED'})).status).toBe(403);
  });
  it('supports policy publishing and acknowledgement',async()=>{
    const policy=succeeds(await call('HR','post','/policies',{policyName:'Synthetic QA policy',policyCategory:'HR_POLICY',filePath:'/api/uploads/synthetic.pdf',acknowledgementRequired:true}));
    succeeds(await call('EMPLOYEE','post',`/policies/${policy.id}/acknowledge`,{status:'ACKNOWLEDGED'}));
    succeeds(await call('EMPLOYEE','post',`/policies/${policy.id}/acknowledge`,{status:'ACKNOWLEDGED'}));
    expect(await prisma.policyAcknowledgement.count({where:{policyId:policy.id,employeeId:employeeIds.EMPLOYEE}})).toBe(1);
  });
  it('supports employee to HR to manager to final performance approval with private ratings',async()=>{
    const review=succeeds(await call('HR','post','/performance',{employeeId:employeeIds.EMPLOYEE,reviewPeriod:'MONTHLY'}));
    const metrics=(score:number)=>Object.fromEntries(performanceMetricKeys.map(key=>[key,score]));
    succeeds(await call('EMPLOYEE','put',`/performance/${review.id}/self-appraisal`,{metricRatings:metrics(5),employeeComments:'Private self comments'}));
    succeeds(await call('HR','put',`/performance/${review.id}/hr-appraisal`,{metricRatings:metrics(3),hrComments:'Final HR comments'}));
    const interim=succeeds(await call('EMPLOYEE','get','/performance/my-reviews')).find((r:any)=>r.id===review.id);
    expect(interim.finalRating).toBeNull(); expect(interim.hrComments).toBeNull(); expect(interim).not.toHaveProperty('managerComments');
    succeeds(await call('MANAGER','put',`/performance/${review.id}/manager-appraisal`,{metricRatings:metrics(4),managerComments:'Private manager comments'}));
    succeeds(await call('ADMIN','put',`/performance/${review.id}/final-approval`,{approvalStatus:'APPROVED'}));
    const final=succeeds(await call('EMPLOYEE','get','/performance/my-reviews')).find((r:any)=>r.id===review.id);
    expect(Number(final.finalRating)).toBe(4); expect(final.hrComments).toBe('Final HR comments');
  });
  it('employees can mark their own notifications read, and staff cannot delete another recipient notification',async()=>{
    const own=await prisma.notification.create({data:{notificationType:'QUERY_NOTIF',message:'Synthetic notification',recipientId:employeeIds.EMPLOYEE}});
    succeeds(await call('EMPLOYEE','patch',`/notifications/${own.id}/read`));
    expect((await call('HR','delete',`/notifications/${own.id}`)).status).toBeGreaterThanOrEqual(400);
    expect(await prisma.notification.findUnique({where:{id:own.id}})).not.toBeNull();
  });
  it('supports department creation and editing while employees remain read only',async()=>{
    const department=succeeds(await call('HR','post','/departments',{name:'QA Department '+Date.now()}));
    succeeds(await call('HR','put',`/departments/${department.id}`,{name:'Updated '+department.name}));
    succeeds(await call('EMPLOYEE','get',`/departments/${department.id}`));
    expect((await call('EMPLOYEE','put',`/departments/${department.id}`,{name:'Forbidden'})).status).toBe(403);
  });
  it('supports asset allocation and return while enforcing assignment ownership',async()=>{
    const asset=succeeds(await call('HR','post','/assets',{assetType:'LAPTOP',assetCategory:'IT',serialNumber:'QA-'+Date.now(),purchaseDate:'2030-01-01',purchaseValue:1000,status:'RETURNED'}));
    succeeds(await call('HR','put',`/assets/${asset.id}/assign`,{assignedEmployeeId:employeeIds.EMPLOYEE,issueCondition:'NEW'}));
    succeeds(await call('EMPLOYEE','get',`/assets/${asset.id}`));
    expect((await call('OTHER','get',`/assets/${asset.id}`)).status).toBeGreaterThanOrEqual(400);
    expect((await call('OTHER','put',`/assets/${asset.id}/return`,{returnCondition:'RETURN_GOOD'})).status).toBeGreaterThanOrEqual(400);
    const requested=succeeds(await call('EMPLOYEE','put',`/assets/${asset.id}/return`,{returnCondition:'RETURN_GOOD'}));
    expect(requested.status).toBe('RETURN_REQUESTED'); expect(requested.assignedEmployeeId).toBe(employeeIds.EMPLOYEE);
    succeeds(await call('HR','put',`/assets/${asset.id}/return`,{returnCondition:'RETURN_GOOD'}));
    expect((await prisma.asset.findUniqueOrThrow({where:{id:asset.id}})).assignedEmployeeId).toBeNull();
  });
  it('does not leak password hashes from account management mutations and uses current roles',async()=>{
    const changed=succeeds(await call('ADMIN','patch',`/users/${userIds.OTHER}/role`,{role:'HR'}));
    expect(changed).not.toHaveProperty('password');
    let elevatedToken: string;
    try {
      succeeds(await call('OTHER','get','/users'));
      elevatedToken=succeeds(await request(app).post('/api/auth/login').send({email:'other@portal-qa.test',password:'Portal-QA-only-20261012'})).token;
    }
    finally {await prisma.user.update({where:{id:userIds.OTHER},data:{role:'EMPLOYEE'}});}
    expect((await request(app).get('/api/users').set('Authorization',`Bearer ${elevatedToken!}`)).status).toBe(403);
    const current=succeeds(await call('OTHER','get','/auth/me')); expect(current.role).toBe('EMPLOYEE');
  });
  it('rejects impossible leave dates without storing rolled over dates',async()=>{
    expect((await call('EMPLOYEE','post','/leaves/apply',{leaveType:'UNPAID',startDate:'2030-04-31',endDate:'2030-04-31',reason:'Invalid date'})).status).toBe(400);
  });
  it('supports employee onboarding, updates and soft deactivation',async()=>{
    const unique=Date.now();
    const {employee}=succeeds(await call('HR','post','/employees',{employeeCode:`QA-NEW-${unique}`,firstName:'Synthetic',lastName:'Employee',email:`new-${unique}@portal-qa.test`,designation:'QA Analyst',joiningDate:'2030-01-01'}));
    succeeds(await call('HR','put',`/employees/${employee.id}`,{designation:'QA Specialist'}));
    expect((await call('OTHER','get',`/employees/${employee.id}`)).status).toBe(404);
    succeeds(await call('HR','delete',`/employees/${employee.id}`));
    expect((await prisma.employee.findUniqueOrThrow({where:{id:employee.id}})).isActive).toBe(false);
  });
  it('rejects disguised profile content and serves only referenced image bytes', async()=>{
    const original = await prisma.employee.findUniqueOrThrow({where:{id:employeeIds.EMPLOYEE},select:{profilePhoto:true}});
    const invalid=await request(app).post(`/api/employees/${employeeIds.EMPLOYEE}/photo`).set('Authorization',`Bearer ${tokens.HR}`).attach('photo',Buffer.from('<svg onload="alert(1)"></svg>'),'photo.png');
    expect(invalid.status).toBe(400);
    const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6xkAAAAASUVORK5CYII=','base64');
    const uploaded=await request(app).post(`/api/employees/${employeeIds.EMPLOYEE}/photo`).set('Authorization',`Bearer ${tokens.HR}`).attach('photo',png,'photo.png');
    const photo=succeeds(uploaded).profilePhoto;
    try {
      const download=await request(app).get(photo);
      expect(download.status).toBe(200);
      expect(download.headers['content-type']).toMatch(/^image\/png/);
      expect(download.body).toEqual(png);
      await prisma.employee.update({where:{id:employeeIds.EMPLOYEE},data:{profilePhoto:original.profilePhoto}});
      expect((await request(app).get(photo)).status).toBe(403);
    } finally {
      await prisma.employee.update({where:{id:employeeIds.EMPLOYEE},data:{profilePhoto:original.profilePhoto}});
      const file=path.join(uploadsDirectory,path.basename(photo));
      if(fs.existsSync(file)) fs.unlinkSync(file);
    }
  });

  it('supports protected employee document upload, verification and download',async()=>{
    const uploaded=await request(app).post('/api/employees/documents/upload').set('Authorization',`Bearer ${tokens.HR}`).field('employeeId',employeeIds.EMPLOYEE).field('documentType','OTHER').field('documentName','synthetic.txt').attach('file',Buffer.from('Synthetic QA document only'),'synthetic.txt');
    const document=succeeds(uploaded);
    try {
      succeeds(await call('HR','put',`/employees/documents/${document.id}/verify`,{}));
      expect((await call('EMPLOYEE','get',`/employees/documents/${document.id}/download`)).text).toBe('Synthetic QA document only');
      expect((await call('OTHER','get',`/employees/documents/${document.id}/download`)).status).toBe(403);
      expect((await request(app).get('/api/uploads/'+path.basename(document.filePath))).status).toBeGreaterThanOrEqual(400);
      const filename=path.basename(document.filePath);
      expect((await request(app).get('/api/uploads/%'+filename.charCodeAt(0).toString(16)+filename.slice(1))).status).toBe(403);
      succeeds(await call('HR','delete',`/employees/documents/${document.id}`));
      expect((await request(app).get('/api/uploads/'+filename)).status).toBeGreaterThanOrEqual(400);
    } finally {
      await prisma.employeeDocument.deleteMany({where:{id:document.id}});
      const localFile=path.join(uploadsDirectory,path.basename(document.filePath));
      if(fs.existsSync(localFile)) fs.unlinkSync(localFile);
    }
  });
  it('produces permitted exports, audit, attrition and permission matrix results',async()=>{
    for(const type of ['employees','travel','assets','recruitment','training']) {
      succeeds(await call('HR','get',`/dashboard/reports/${type}`));
      expect((await call('EMPLOYEE','get',`/dashboard/reports/${type}`)).status).toBe(403);
    }
    succeeds(await call('ADMIN','get','/dashboard/attrition'));
    succeeds(await call('ADMIN','get','/permissions'));
    for(const role of ['ADMIN','HR','MANAGER','EMPLOYEE']) succeeds(await call(role,'get','/permissions/my'));
    expect((await call('EMPLOYEE','get','/permissions')).status).toBe(403);
    expect((await call('MANAGER','get','/users')).status).toBe(403);
  });
});
