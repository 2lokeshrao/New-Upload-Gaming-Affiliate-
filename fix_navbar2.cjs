const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace the three `</div>`s with just two, because we had an extra one
code = code.replace(
  "</div>\n          </div>\n          </div>",
  "</div>\n          </div>"
);

fs.writeFileSync('src/components/Navbar.tsx', code, 'utf8');
console.log('Fixed nesting in Navbar.tsx');
