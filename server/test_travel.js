const http = require('http');

const data = JSON.stringify({
  email: 'admin@hrms.com',
  password: 'admin'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const token = JSON.parse(body).data.token;
    console.log("Token received.");
    
    // Now create travel request
    const travelData = JSON.stringify({
      travelPurpose: 'Client Meeting',
      destination: 'London',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      travelMode: 'AIR',
      advanceRequested: 500,
      billUpload: ''
    });

    const travelReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/travel',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': travelData.length
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log("Travel Response:", body2);
      });
    });
    travelReq.write(travelData);
    travelReq.end();
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
