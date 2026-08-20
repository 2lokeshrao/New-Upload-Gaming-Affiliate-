const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// I will just remove the Search entirely and correctly format tags.
// Let's use simple string replacements instead of regex

// Fix matching tags - let's see how broken it is first
