const https = require('https');

const postData = JSON.stringify({
  source_code: "print('hello from paiza!')",
  language: "python",
  api_key: "guest"
});

const req = https.request('https://api.paiza.io/runners/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log("Create response:", data);
    const parsed = JSON.parse(data);
    if (parsed.id) {
      setTimeout(() => {
        https.get(`https://api.paiza.io/runners/get_details?id=${parsed.id}&api_key=guest`, (res2) => {
          let data2 = '';
          res2.on('data', c => data2 += c);
          res2.on('end', () => console.log("Details response:", data2));
        });
      }, 2000);
    }
  });
});
req.write(postData);
req.end();
