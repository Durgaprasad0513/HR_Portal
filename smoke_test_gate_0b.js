const http = require('http');

async function run() {
  console.log('--- Gate 0B Smoke Tests ---');

  // 1. Login as ananya.patel@hrms.com (Employee)
  console.log('Attempting login as Employee (ananya.patel@hrms.com)...');
  let res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ananya.patel@hrms.com', password: 'password123' })
  });
  if (!res.ok) throw new Error('Failed to login as employee');
  let data = await res.json();
  const empToken = data.data.token;
  const empId = data.data.user.employeeId;
  console.log('✅ Logged in successfully.');

  // 2. Read own profile (should pass)
  console.log('Attempting to read own profile...');
  res = await fetch(`http://localhost:5000/api/employees/${empId}`, {
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  if (!res.ok) throw new Error('Failed to read own profile');
  console.log('✅ Read own profile successfully.');

  // 3. Try to read Vikram Singh's profile (should be denied or not found because scope is SELF)
  // Let's first get Vikram's ID using Admin
  console.log('Fetching unrelated employee ID via Admin...');
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
  });
  const adminData = await res.json();
  const adminToken = adminData.data.token;

  res = await fetch('http://localhost:5000/api/employees', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const allEmps = await res.json();
  const vikram = allEmps.data.find(e => e.email === 'vikram.singh@hrms.com');
  
  console.log("Attempting to read Vikram's profile using Ananya's token...");
  res = await fetch(`http://localhost:5000/api/employees/${vikram.id}`, {
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  // Should return 404 or 403. Our implementation returns 404 "Employee not found or not accessible"
  if (res.ok) throw new Error('Cross-employee read SHOULD HAVE FAILED but succeeded!');
  console.log('✅ Cross-employee read securely denied (Status: ' + res.status + ').');

  // 4. Test Restricted Fields (REMOVED_ROLE)
  console.log('Logging in as REMOVED_ROLE (hr.exec@hrms.com)...');
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'hr.exec@hrms.com', password: 'password123' })
  });
  const hrExecData = await res.json();
  const hrExecToken = hrExecData.data.token;

  console.log('Fetching employee profile via HR Exec...');
  res = await fetch(`http://localhost:5000/api/employees/${empId}`, {
    headers: { 'Authorization': `Bearer ${hrExecToken}` }
  });
  const empProfileHR = await res.json();
  if (empProfileHR.data.salary !== null || empProfileHR.data.bankAccountNumber !== null) {
     throw new Error('REMOVED_ROLE can see restricted fields! ' + JSON.stringify(empProfileHR.data));
  }
  console.log('✅ Restricted fields are successfully stripped for REMOVED_ROLE.');

  // 5. Test Session Revocation (simulate by disabling user)
  // Instead of disabling a main user, let's just make sure the token fails if we manually change tokenVersion
  // I can't easily trigger it without a route to deactivate. 
  // Wait, I can deactivate Ananya via Admin. Let's do that!
  console.log('Deactivating Ananya via Admin to test session revocation...');
  res = await fetch(`http://localhost:5000/api/employees/${empId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  if (!res.ok) throw new Error('Failed to deactivate employee via admin');
  
  console.log('Attempting to use Ananya\'s token after deactivation...');
  res = await fetch(`http://localhost:5000/api/employees/${empId}`, {
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  if (res.ok) throw new Error('Session was NOT revoked after deactivation!');
  console.log('✅ Session securely revoked (Status: ' + res.status + ').');
  
  console.log('--- All Gate 0B Smoke Tests Passed ---');
}

run().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
