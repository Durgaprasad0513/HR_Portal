const fs = require('fs');
fs.writeFileSync('test_photo.png', 'fake image data');

async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hrms.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    // Create FormData natively in Node? No, Node 18+ has FormData
    const formData = new FormData();
    const file = new File(['fake image data'], 'test_photo.png', { type: 'image/png' });
    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:5000/api/assets/upload-photo', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    console.log('Upload Response:', uploadData);
  } catch (err) {
    console.log('Error:', err);
  }
}
test();
