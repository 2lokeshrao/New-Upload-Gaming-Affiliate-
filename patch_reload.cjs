const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the first instance
code = code.replace(
  "if (!document.cookie.includes(`googtrans=${cookieVal}`)) {",
  "if (!document.cookie.includes(`googtrans=${cookieVal}`) && !sessionStorage.getItem('googtrans_attempted')) {\n              sessionStorage.setItem('googtrans_attempted', 'true');"
);

// Replace the second instance
code = code.replace(
  "if (!document.cookie.includes(`googtrans=${cookieVal}`)) {",
  "if (!document.cookie.includes(`googtrans=${cookieVal}`) && !sessionStorage.getItem('googtrans_attempted')) {\n              sessionStorage.setItem('googtrans_attempted', 'true');"
);

fs.writeFileSync('src/App.tsx', code);
