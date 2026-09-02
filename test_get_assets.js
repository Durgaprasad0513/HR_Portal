async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    const assetRes = await fetch('http://localhost:5000/api/assets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const assetData = await assetRes.json();
    console.log(assetData.data[0]);
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
