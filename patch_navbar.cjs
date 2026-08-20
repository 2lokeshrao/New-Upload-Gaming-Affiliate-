const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Remove Search block
code = code.replace(
  /\{\/\* Search \*\/\}([\s\S]*?)<\/div>\n            <\/div>/,
  "</div>\n          </div>"
);

// Remove mobile search block
code = code.replace(
  /<div className="relative mb-4">[\s\S]*?<\/div>[\s\S]*?\{\/\* Mobile Search Results \*\/\}([\s\S]*?)<\/div>\n          \)\}/,
  ""
);

// Remove Get App button block
code = code.replace(
  /\{onOpenAppModal && \([\s\S]*?<\/button>\n            \)\}/,
  ""
);

fs.writeFileSync('src/components/Navbar.tsx', code, 'utf8');
console.log('Patched Navbar.tsx');
