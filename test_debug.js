const request = require('supertest');
const { app } = require('./server/src/app'); // Wait, app is exported as default. Let's see.

async function run() {
  const mod = require('./server/src/app');
  const application = mod.default || mod;
  const res = await request(application).post('/api/auth/login').send({ email: 'ananya.patel@hrms.com', password: 'password123' });
  console.log('Ananya Login Status:', res.status);
  console.log('Ananya Login Body:', res.body);
  
  const resAdmin = await request(application).post('/api/auth/login').send({ email: 'admin@hrms.com', password: 'password123' });
  console.log('Admin Login Status:', resAdmin.status);
  console.log('Admin Login Body:', resAdmin.body);
}
run();
