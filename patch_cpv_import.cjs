const fs = require('fs');
let code = fs.readFileSync('src/components/CustomPageView.tsx', 'utf8');

code = code.replace(
  "import { ChevronRight, HelpCircle, ChevronDown, Gamepad2, Gift } from 'lucide-react';",
  "import { ChevronRight, HelpCircle, ChevronDown, Gamepad2, Gift, Globe } from 'lucide-react';"
);

fs.writeFileSync('src/components/CustomPageView.tsx', code, 'utf8');
console.log('Fixed CustomPageView import');
