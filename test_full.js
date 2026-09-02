async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    console.log("Testing POST /api/assets...");
    const sn = "SN" + Math.floor(Math.random() * 1000000);
    const assetRes = await fetch('http://localhost:5000/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        assetType: 'LAPTOP',
        assetCategory: 'IT',
        brandModel: 'Dell XPS 3',
        serialNumber: sn,
      })
    });
    const assetData = await assetRes.json();
    console.log('Asset Create Response:', assetData);
    
    if (assetData.success) {
      console.log("Testing PUT /api/assets/" + assetData.data.id + " ...");
      const updateRes = await fetch(`http://localhost:5000/api/assets/${assetData.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: 'RETURNED',
          assetLocation: 'NYC Office',
          assignedEmployeeId: null
        })
      });
      console.log('Asset Update Response:', await updateRes.json());
    }
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
