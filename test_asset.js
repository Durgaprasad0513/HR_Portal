async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    // Need an employee ID first
    const empRes = await fetch('http://localhost:5000/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const empData = await empRes.json();
    const empId = empData.data[0].id;

    const assetRes = await fetch('http://localhost:5000/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        assetType: 'LAPTOP',
        assetCategory: 'IT',
        brandModel: 'Dell XPS',
        serialNumber: 'SN12345678',
        assignedEmployeeId: empId,
        status: 'IN_USE'
      })
    });
    const assetData = await assetRes.json();
    console.log('Asset Create Response:', assetData);
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
