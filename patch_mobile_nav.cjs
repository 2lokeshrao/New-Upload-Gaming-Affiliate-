const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const mobileMenu = `
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-slate-900 border-b border-slate-800 shadow-xl absolute w-full max-h-[85vh] overflow-y-auto">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50">Home</a>
          
          <div className="pt-2 pb-1">
            <div className="px-3 text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Landmark className="w-4 h-4"/> Gaming Brands</div>
            <div className="space-y-1 pl-2">
              {platforms.filter(p => p.isActive).map(p => (
                <a
                  key={p.id}
                  href={\`/brands/\${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-\${countrySlug}\`}
                  onClick={(e) => handleNav(e, \`/brands/\${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-\${countrySlug}\`)}
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-2 pb-1">
            <div className="px-3 text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Articles & Loans</div>
            <div className="space-y-1 pl-2">
              <a href="/personal-loan" onClick={(e) => handleNav(e, '/personal-loan')} className="block px-3 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-md">Personal Loan Options</a>
              <a href="/home-loan" onClick={(e) => handleNav(e, '/home-loan')} className="block px-3 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-md">Home Loan Guide</a>
              {customPages.filter(p => p.isActive).slice(0, 5).map(p => (
                <a
                  key={p.id}
                  href={\`/\${p.slug}\`}
                  onClick={(e) => handleNav(e, \`/\${p.slug}\`)}
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"
                >
                  {p.title}
                </a>
              ))}
              <a href="/articles" onClick={(e) => handleNav(e, '/articles')} className="block px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-md font-bold">View All Articles &rarr;</a>
            </div>
          </div>

          <a href="/banking/best-virtual-cards-for-gaming" onClick={(e) => handleNav(e, '/banking/best-virtual-cards-for-gaming')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50 flex items-center gap-2 mt-2"><CreditCard className="w-5 h-5"/> Cards & Finance</a>
          <a href="/crypto/binance-usdt-withdrawal-guide" onClick={(e) => handleNav(e, '/crypto/binance-usdt-withdrawal-guide')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50 flex items-center gap-2"><Globe className="w-5 h-5"/> Crypto Guides</a>
        </div>
      )}
    </nav>
  );
};
`;

code = code.replace(
  /\{\/\* Mobile Menu \*\/\}[\s\S]*\}\;\n\}\;/g,
  mobileMenu.trim()
);

fs.writeFileSync('src/components/Navbar.tsx', code, 'utf8');
console.log('Patched Mobile Menu in Navbar.tsx');
