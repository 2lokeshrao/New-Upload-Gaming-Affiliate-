fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    console.log(data.platforms.map(p => p.id).join(', '));
  }).catch(console.error);
