import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Gate 5 Notification Dispatch', () => {
  let adminToken: string;
  let empToken: string;
  let empEmployeeId: string;

  beforeAll(async () => {
    const resAdmin = await request(app).post('/api/auth/login').send({ email: 'admin@hrms.com', password: 'password123' });
    adminToken = resAdmin.body.data.token;

    const resEmp = await request(app).post('/api/auth/login').send({ email: 'ananya.patel@hrms.com', password: 'password123' });
    empToken = resEmp.body.data.token;
    empEmployeeId = resEmp.body.data.user.employeeId;
  });

  afterAll(async () => {
    // Clean up test notifications
    await prisma.notification.deleteMany({
      where: { 
        recipient: { email: 'ananya.patel@hrms.com' },
        triggerEvent: { in: ['APPROVAL_APPROVED', 'APPROVAL_REJECTED', 'ASSET_ASSIGNED', 'APPROVAL_PENDING'] }
      }
    });
    await prisma.travelRequest.deleteMany({
      where: { employeeId: empEmployeeId, destination: 'Notification Test City' }
    });
    await prisma.$disconnect();
  });

  it('Employee can read their notifications', async () => {
    const res = await request(app).get('/api/notifications').set('Authorization', `Bearer ${empToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('Employee can get unread count', async () => {
    const res = await request(app).get('/api/notifications/unread-count').set('Authorization', `Bearer ${empToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('Travel approval creates an in-app notification', async () => {
    // Create a travel request
    const travelRes = await request(app).post('/api/travel').set('Authorization', `Bearer ${empToken}`).send({
      travelPurpose: 'Notification Test',
      destination: 'Notification Test City',
      startDate: new Date('2027-01-10').toISOString(),
      endDate: new Date('2027-01-15').toISOString(),
      travelMode: 'AIR'
    });
    expect(travelRes.status).toBe(200);
    const travelId = travelRes.body.data.id;

    // Approve it
    const approveRes = await request(app).put(`/api/travel/${travelId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ approvalStatus: 'APPROVAL_APPROVED' });
    expect(approveRes.status).toBe(200);

    // Small wait to let async notification persist
    await new Promise(r => setTimeout(r, 200));

    // Check notification was created
    const notification = await prisma.notification.findFirst({
      where: {
        recipientId: empEmployeeId,
        notificationType: 'TRAVEL_NOTIF',
        triggerEvent: 'APPROVAL_APPROVED'
      },
      orderBy: { createdAt: 'desc' }
    });
    expect(notification).not.toBeNull();
    expect(notification?.message).toContain('Notification Test City');
    expect(notification?.message).toContain('approved');
  });

  it('Employee can mark a notification as read', async () => {
    const note = await prisma.notification.findFirst({
      where: { recipientId: empEmployeeId }
    });
    if (!note) return; // Skip if no notifications

    const res = await request(app)
      .patch(`/api/notifications/${note.id}/read`)
      .set('Authorization', `Bearer ${empToken}`);
    expect(res.status).toBe(200);
  });

  it('Employee can mark all notifications as read', async () => {
    const res = await request(app)
      .patch('/api/notifications/mark-all-read')
      .set('Authorization', `Bearer ${empToken}`);
    expect(res.status).toBe(200);
  });
});
