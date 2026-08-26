const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /if \(password === ADMIN_PASSCODE\) \{\n\s+\/\/ Successful login -> Reset rate limiter record\n\s+loginAttemptTracker\[clientIp\] = \{ attempts: \[\], lockUntil: 0 \};\n\s+const token = jwt.sign\(\{ role: 'admin', authAt: Date.now\(\) \}, JWT_SECRET, \{ expiresIn: '8h' \}\);\n\s+return res.json\(\{ success: true, token \}\);\n\s+\} else \{/,
  `if (password === ADMIN_PASSCODE) {
    // Successful login -> Reset rate limiter record
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
    const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token });
  } else if (password === DEMO_PASSCODE) {
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
    const token = jwt.sign({ role: 'demo', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token, isDemo: true });
  } else {`
);
fs.writeFileSync('server.ts', content);
