fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    const p = data.platforms.find(p => p.id === 'rajabets' || p.name.toLowerCase().includes('rajabet'));
    console.log(p);
  }).catch(console.error);
