// Regression: recruitment lifecycle, validation, and scheduling contracts.
// Found by /qa on 2026-10-10.
// Report: .gstack/qa-reports/recruitment-20261010/report.md
import request from 'supertest';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/database';
import app from '../src/app';

jest.mock('../src/utils/email.service', () => ({ emailService: { sendWelcomeEmail: jest.fn() } }));
const databaseUrl = new URL(process.env.DATABASE_URL || 'postgresql://localhost/disabled');
const enabled = ['localhost', '127.0.0.1'].includes(databaseUrl.hostname) && databaseUrl.pathname.startsWith('/hr_recruitment_qa_');
const suite = enabled ? describe : describe.skip;

suite('Recruitment API journey with isolated HR and management identities', () => {
  jest.setTimeout(30000);
  const tokens: Record<string, string> = {};
  let departmentId: string;
  let interviewerId: string;
  const api = (role: string) => ({
    post: (path: string, body: any) => request(app).post('/api/recruitment' + path).set('Authorization', `Bearer ${tokens[role]}`).send(body),
    put: (path: string, body: any) => request(app).put('/api/recruitment' + path).set('Authorization', `Bearer ${tokens[role]}`).send(body),
    get: (path: string) => request(app).get('/api/recruitment' + path).set('Authorization', `Bearer ${tokens[role]}`),
  });
  beforeAll(async () => {
    // Only this explicitly guarded, disposable database is reset between replays.
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users", "employees", "departments", "requisitions", "candidates" CASCADE');
    departmentId = (await prisma.department.create({ data: { name: 'Recruitment QA' } })).id;
    const password = 'Disposable-QA-' + Date.now();
    for (const role of ['HR', 'MANAGER', 'EMPLOYEE'] as const) {
      const employee = await prisma.employee.create({ data: {
        employeeCode: 'QA-' + role, firstName: 'QA', lastName: role,
        email: `${role.toLowerCase()}@recruitment.test`, designation: role,
        joiningDate: new Date(), departmentId,
      } });
      await prisma.user.create({ data: { email: employee.email, role, employeeId: employee.id, password: await bcrypt.hash(password, 4) } });
      if (role === 'MANAGER') interviewerId = employee.id;
      const login = await request(app).post('/api/auth/login').send({ email: employee.email, password });
      expect(login.status).toBe(200);
      tokens[role] = login.body.data.token;
    }
  });
  afterAll(async () => { await prisma.$disconnect(); });

  it('enforces a management read-only override at the API', async () => {
    const reqId = await opening();
    const id = await schedule(reqId);
    const where = { role_module: { role: 'MANAGER' as const, module: 'recruitment' } };
    await prisma.modulePermission.update({ where, data: { canEdit: false } });
    try {
      expect((await api('MANAGER').get('/interviews')).status).toBe(200);
      expect((await api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: 'SELECTED' })).status).toBe(403);
      expect((await prisma.candidate.findUniqueOrThrow({ where: { id } })).selectionStatus).toBeNull();
    } finally { await prisma.modulePermission.update({ where, data: { canEdit: true } }); }
  });

  it('rejects invalid dates without changing a scheduled interview', async () => {
    const id = await schedule(await opening());
    const before = await prisma.candidate.findUniqueOrThrow({ where: { id } });
    expect((await api('HR').put(`/candidates/${id}/interview`, { interviewDate: 'not-a-date' })).status).toBe(400);
    expect((await prisma.candidate.findUniqueOrThrow({ where: { id } })).interviewDate).toEqual(before.interviewDate);
  });

  it('supports screening rejection and restoration with notes', async () => {
    const id = await schedule(await opening());
    expect((await api('HR').put(`/candidates/${id}/screen`, { screeningStatus: 'SCREENING_REJECTED', screeningNotes: 'QA screen' })).status).toBe(200);
    expect((await api('HR').put(`/candidates/${id}/screen`, { screeningStatus: 'SHORTLISTED' })).status).toBe(200);
    const candidate = await prisma.candidate.findUniqueOrThrow({ where: { id } });
    expect(candidate.screeningStatus).toBe('SHORTLISTED');
    expect(candidate.screeningNotes).toBe('QA screen');
  });

  it('reopens automatically filled vacancies when capacity increases and refuses capacity below selections', async () => {
    const reqId = await opening(1);
    const id = await schedule(reqId);
    expect((await api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: 'SELECTED' })).status).toBe(200);
    expect((await api('HR').put(`/requisitions/${reqId}`, { numberOfVacancies: 2 })).status).toBe(200);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id: reqId } })).status).toBe('REQUIREMENT');
    const second = await schedule(reqId);
    expect((await api('MANAGER').put(`/candidates/${second}/interview`, { selectionStatus: 'SELECTED' })).status).toBe(200);
    expect((await api('HR').put(`/requisitions/${reqId}`, { numberOfVacancies: 1 })).status).toBe(400);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id: reqId } })).numberOfVacancies).toBe(2);
  });

  const opening = async (count = 1) => {
    const res = await api('HR').post('/requisitions', { positionTitle: 'QA Developer', location: 'QA Office', departmentId, numberOfVacancies: count });
    expect(res.status).toBe(200);
    return res.body.data.id;
  };
  const schedule = async (id: string) => {
    const res = await api('HR').post('/candidates', { candidateName: 'Synthetic Candidate', email: 'candidate@recruitment.test', requisitionId: id,
      screeningStatus: 'SHORTLISTED', interviewDate: '2026-11-01T09:00:00.000Z', interviewRound: 'TELEPHONIC', interviewerId, interviewLocation: 'QA Meeting' });
    expect(res.status).toBe(200);
    return res.body.data.id;
  };
  test('HR schedules, management progresses rounds, selection fills the vacancy and updates dashboard', async () => {
    const reqId = await opening();
    const id = await schedule(reqId);
    const beforeDashboard = await request(app).get('/api/dashboard/stats').set('Authorization', `Bearer ${tokens.MANAGER}`);
    for (const interviewRound of ['HR_INTERVIEW', 'TECHNICAL', 'MANAGEMENT']) {
      const result = await api('MANAGER').put(`/candidates/${id}/interview`, { interviewRound });
      expect(result.status).toBe(200);
    }
    expect((await api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: 'SELECTED' })).status).toBe(200);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id: reqId } })).status).toBe('CLOSED');
    const list = await api('HR').get('/requisitions');
    expect(list.body.data.find((r: any) => r.id === reqId)).toMatchObject({ status: 'CLOSED', selectedCount: 1 });
    const dashboard = await request(app).get('/api/dashboard/stats').set('Authorization', `Bearer ${tokens.MANAGER}`);
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.data.headline.openVacancies).toBe(beforeDashboard.body.data.headline.openVacancies - 1);
  });
  test('one offer does not close an opening with two vacancies', async () => {
    const reqId = await opening(2);
    const id = await schedule(reqId);
    expect((await api('HR').put(`/candidates/${id}/offer`, { offerStatus: 'RELEASED' })).status).toBe(200);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id: reqId } })).status).not.toBe('CLOSED');
  });
  test('rescheduling updates the date, panel and venue without creating another candidate', async () => {
    const reqId = await opening();
    const id = await schedule(reqId);
    const res = await api('HR').put(`/candidates/${id}/interview`, { interviewDate: '2026-11-02T10:30:00.000Z', interviewLocation: 'QA Rescheduled' });
    expect(res.status).toBe(200);
    const stored = await prisma.candidate.findUniqueOrThrow({ where: { id } });
    expect(stored.interviewDate?.toISOString()).toBe('2026-11-02T10:30:00.000Z');
    expect(stored.interviewLocation).toBe('QA Rescheduled');
    expect(await prisma.candidate.count({ where: { requisitionId: reqId } })).toBe(1);
  });
  test.each([0, -1, 1.5])('invalid vacancy count %s is rejected for editing without state change', async numberOfVacancies => {
    const id = await opening();
    expect((await api('HR').put(`/requisitions/${id}`, { numberOfVacancies })).status).toBe(400);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id } })).numberOfVacancies).toBe(1);
  });
  test('reject and restore in-progress preserve a valid candidate record', async () => {
    const reqId = await opening();
    const id = await schedule(reqId);
    expect((await api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: 'SELECTION_REJECTED' })).status).toBe(200);
    expect((await prisma.candidate.findUniqueOrThrow({ where: { id } })).selectionStatus).toBe('SELECTION_REJECTED');
    expect((await api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: null })).status).toBe(200);
    expect((await prisma.candidate.findUniqueOrThrow({ where: { id } })).selectionStatus).toBeNull();
  });
  test('invalid interview round is rejected without changing the round', async () => {
    const id = await schedule(await opening());
    expect((await api('HR').put(`/candidates/${id}/interview`, { interviewRound: 'INVALID_ROUND' })).status).toBe(400);
    expect((await prisma.candidate.findUniqueOrThrow({ where: { id } })).interviewRound).toBe('TELEPHONIC');
  });
  test('closed requisitions cannot receive new scheduled candidates', async () => {
    const reqId = await opening();
    expect((await api('HR').put(`/requisitions/${reqId}/status`, { status: 'CLOSED' })).status).toBe(200);
    const res = await api('HR').post('/candidates', { candidateName: 'Blocked QA', requisitionId: reqId });
    expect(res.status).toBe(400);
    expect(await prisma.candidate.count({ where: { requisitionId: reqId } })).toBe(0);
  });
  test('missing identity and employee access are denied', async () => {
    expect((await request(app).get('/api/recruitment/interviews')).status).toBe(401);
    expect((await api('EMPLOYEE').get('/interviews')).status).toBe(403);
    expect((await api('EMPLOYEE').post('/requisitions', { positionTitle: 'Denied', location: 'QA', departmentId, numberOfVacancies: 1 })).status).toBe(403);
  });
  test('concurrent management edits preserve both feedback and rescheduling', async () => {
    const id = await schedule(await opening());
    const results = await Promise.all([
      api('MANAGER').put(`/candidates/${id}/interview`, { interviewFeedback: 'QA panel feedback' }),
      api('HR').put(`/candidates/${id}/interview`, { interviewDate: '2026-11-03T09:00:00.000Z' }),
    ]);
    expect(results.map(result => result.status)).toEqual([200, 200]);
    const saved = await prisma.candidate.findUniqueOrThrow({ where: { id } });
    expect(saved.interviewFeedback).toBe('QA panel feedback');
    expect(saved.interviewDate?.toISOString()).toBe('2026-11-03T09:00:00.000Z');
  });
  test('concurrent selections cannot overfill a single vacancy', async () => {
    const reqId = await opening();
    const ids = [await schedule(reqId), await schedule(reqId)];
    const results = await Promise.all(ids.map(id => api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: 'SELECTED' })));
    expect(results.map(result => result.status).sort()).toEqual([200, 400]);
    expect(await prisma.candidate.count({ where: { requisitionId: reqId, selectionStatus: 'SELECTED' } })).toBe(1);
  });
  test('declining an offer reopens an automatically filled opening and removes its filled count', async () => {
    const reqId = await opening();
    const id = await schedule(reqId);
    expect((await api('MANAGER').put(`/candidates/${id}/offer`, { offerStatus: 'RELEASED', offeredSalary: 50000, offerDate: '2026-11-01T00:00:00Z' })).status).toBe(200);
    expect((await api('MANAGER').put(`/candidates/${id}/offer`, { offerStatus: 'OFFER_ACCEPTED', joiningDate: '2026-11-10T00:00:00Z' })).status).toBe(200);
    const accepted = await prisma.candidate.findUniqueOrThrow({ where: { id } });
    expect(accepted.offeredSalary?.toString()).toBe('50000');
    expect(accepted.joiningDate?.toISOString()).toBe('2026-11-10T00:00:00.000Z');
    expect((await api('HR').put(`/candidates/${id}/offer`, { offerStatus: 'OFFER_DECLINED' })).status).toBe(200);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id: reqId } })).status).not.toBe('CLOSED');
    const list = await api('HR').get('/requisitions');
    expect(list.body.data.find((r: any) => r.id === reqId).selectedCount).toBe(0);
  });
  test('a manually closed requisition stays closed when a candidate is put on hold', async () => {
    const reqId = await opening();
    const id = await schedule(reqId);
    expect((await api('HR').put(`/requisitions/${reqId}/status`, { status: 'CLOSED' })).status).toBe(200);
    expect((await api('MANAGER').put(`/candidates/${id}/interview`, { selectionStatus: 'SELECTION_ON_HOLD' })).status).toBe(200);
    expect((await prisma.requisition.findUniqueOrThrow({ where: { id: reqId } })).status).toBe('CLOSED');
  });
});
