fetch('http://localhost:3000/api/data').then(r=>r.json()).then(d=>console.log("Size:", JSON.stringify(d.platforms).length))
