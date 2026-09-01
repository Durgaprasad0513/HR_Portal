import request from 'supertest';
import app from '../src/app';

describe('Gate 0B Smoke Tests', () => {
  let adminToken: string;
  let employeeToken: string;
  let hrExecToken: string;
  let employeeId: string;
  let vikramId: string;

  beforeAll(async () => {
    // 1. Get Admin token
    const resAdmin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@hrms.com', password: 'password123' });
    adminToken = resAdmin.body.data.token;

    // 2. Get Vikram's ID via Admin
    const resEmps = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`);
    const vikram = resEmps.body.data.find((e: any) => e.email === 'vikram.singh@hrms.com');
    vikramId = vikram.id;
  });

  it('should login as employee successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ananya.patel@hrms.com', password: 'password123' });
    
    expect(res.status).toBe(200);
    employeeToken = res.body.data.token;
    employeeId = res.body.data.user.employeeId;
  });

  it('should allow employee to read own profile', async () => {
    const res = await request(app)
      .get(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('ananya.patel@hrms.com');
  });

  it('should securely deny cross-employee read', async () => {
    const res = await request(app)
      .get(`/api/employees/${vikramId}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    
    // Employee scope only allows SELF, so trying to read Vikram returns 404 or 403
    expect(res.status).toBe(404);
  });

  it('should strip restricted fields for REMOVED_ROLE', async () => {
    // Login as HR Exec
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'hr.exec@hrms.com', password: 'password123' });
    
    expect(loginRes.status).toBe(200);
    hrExecToken = loginRes.body.data.token;

    const res = await request(app)
      .get(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${hrExecToken}`);
    
    expect(res.status).toBe(200);
    // HR Exec shouldn't see salary or bank info
    expect(res.body.data.salary).toBeNull();
    expect(res.body.data.bankAccountNumber).toBeNull();
  });

  it('should revoke session after deactivation', async () => {
    // Deactivate employee via Admin
    const delRes = await request(app)
      .delete(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(delRes.status).toBe(200);

    // Attempt to use employee token
    const res = await request(app)
      .get(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    
    expect(res.status).toBe(401);
  });
  afterAll(async () => {
    // Reactivate Ananya to prevent subsequent test failures
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.updateMany({
      where: { email: 'ananya.patel@hrms.com' },
      data: { isActive: true }
    });
    await prisma.employee.updateMany({
      where: { email: 'ananya.patel@hrms.com' },
      data: { isActive: true }
    });
    await prisma.$disconnect();
  });
  afterAll(async () => {
    // Reactivate Ananya to prevent subsequent test failures
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.updateMany({
      where: { email: 'ananya.patel@hrms.com' },
      data: { isActive: true }
    });
    await prisma.employee.updateMany({
      where: { email: 'ananya.patel@hrms.com' },
      data: { isActive: true }
    });
    await prisma.$disconnect();
  });
});
