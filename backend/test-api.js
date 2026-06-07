fetch('http://localhost:5000/api/playground/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'print(1)', language: 'python' })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
