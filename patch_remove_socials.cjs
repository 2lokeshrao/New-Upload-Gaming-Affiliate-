const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const targetToRemove = `</a>
          </p>
          {/* Social Media Footer Icons (Bottom) */}
          <div className="flex justify-center py-2 mt-2">
            <SocialMediaBar config={config} variant="footer" />
          </div>`;

const revertTo = `</a>
          </p>`;

if (code.includes(targetToRemove)) {
  code = code.replace(targetToRemove, revertTo);
  fs.writeFileSync('src/components/Footer.tsx', code, 'utf8');
  console.log('Extra social media icons removed from bottom of footer.');
} else {
  console.log('Target not found. Looking for alternatives...');
}
