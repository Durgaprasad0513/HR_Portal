async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    const empsRes = await fetch('http://localhost:5000/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const empsData = await empsRes.json();
    if (empsData.data.length === 0) {
       console.log("No employees found");
       return;
    }
    const empId = empsData.data[0].id;
    console.log("Fetching employee ID:", empId);
    
    const empRes = await fetch(`http://localhost:5000/api/employees/${empId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const empData = await empRes.json();
    console.log("Employee Data Status:", empRes.status);
    if (!empData.success) {
      console.log("Error fetching employee:", empData.message);
    } else {
      console.log("Success! Data keys:", Object.keys(empData.data));
    }
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
