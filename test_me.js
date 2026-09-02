async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ananya.patel@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log("Me Data:", meData.data);
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
