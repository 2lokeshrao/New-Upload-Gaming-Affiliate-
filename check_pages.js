fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data.customPages, null, 2));
  }).catch(console.error);
