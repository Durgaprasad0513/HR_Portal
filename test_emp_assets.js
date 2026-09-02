async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ananya.patel@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log("Logged in as Ananya, employeeId:", loginData.data.user.employeeId);
    
    const assetRes = await fetch('http://localhost:5000/api/assets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const assetData = await assetRes.json();
    console.log("Assets:", assetData.data.map(a => ({ id: a.id, assignedEmployee: a.assignedEmployee })));
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
