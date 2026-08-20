const fs = require('fs');
let code = fs.readFileSync('src/components/CustomPageView.tsx', 'utf8');

code = code.replace(
  "import { injectSeoTags } from '../utils/seo';",
  "import { injectSeoTags, injectCustomPageSchema } from '../utils/seo';"
);

code = code.replace(
  "injectSeoTags(title, desc, url, '');",
  "injectSeoTags(title, desc, url, '');\n    injectCustomPageSchema(page);"
);

fs.writeFileSync('src/components/CustomPageView.tsx', code, 'utf8');
console.log('Patched CustomPageView.tsx for schema');
