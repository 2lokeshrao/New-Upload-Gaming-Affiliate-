const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const effectCode = `
  useEffect(() => {
    loadData();
  }, [adminToken]);

  // Live data polling for Admin
  useEffect(() => {
    let interval;
    if (viewingAdmin && adminToken) {
      interval = setInterval(() => {
        fetch('/api/admin/data', { headers: { Authorization: \`Bearer \${adminToken}\` } })
          .then(res => res.json())
          .then(data => {
            if (data.stats) setStats(data.stats);
            if (data.logs) setLogs(data.logs);
            if (data.subPartners) setSubPartners(data.subPartners);
          })
          .catch(err => console.error("Live data error", err));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [viewingAdmin, adminToken]);
`;

code = code.replace(
  `  useEffect(() => {
    loadData();
  }, []);`, 
  effectCode
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx successfully');
