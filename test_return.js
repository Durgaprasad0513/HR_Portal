async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    // Create an asset that is assigned
    const assetRes = await fetch('http://localhost:5000/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        assetType: 'LAPTOP',
        assetCategory: 'IT',
        brandModel: 'Test Return 2',
        serialNumber: 'RET' + Date.now(),
        assignedEmployeeId: loginData.data.user.employeeId,
        status: 'IN_USE'
      })
    });
    const assetData = await assetRes.json();
    console.log('Asset Create Response:', assetData);
    
    // Now return it
    const returnRes = await fetch(`http://localhost:5000/api/assets/${assetData.data.id}/return`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ returnCondition: 'RETURN_GOOD' })
    });
    const returnData = await returnRes.json();
    console.log('Return Response:', returnData);
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
