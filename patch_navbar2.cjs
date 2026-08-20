const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const loanArticleLinks = `
              <div className="relative group">
                <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1 group-hover:bg-slate-800">
                  <CreditCard className="w-4 h-4"/> Articles & Loans
                </button>
                <div className="absolute left-0 mt-0 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full">
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Loans</div>
                  <a href="/personal-loan" onClick={(e) => handleNav(e, '/personal-loan')} className="block px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700/50">Personal Loan Options</a>
                  <a href="/home-loan" onClick={(e) => handleNav(e, '/home-loan')} className="block px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700/50">Home Loan Guide</a>
                  
                  <div className="border-t border-slate-700 my-2"></div>
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Articles</div>
                  {customPages.filter(p => p.isActive).slice(0, 5).map(p => (
                    <a
                      key={p.id}
                      href={\`/\${p.slug}\`}
                      onClick={(e) => handleNav(e, \`/\${p.slug}\`)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                      {p.title}
                    </a>
                  ))}
                  <a href="/articles" onClick={(e) => handleNav(e, '/articles')} className="block px-4 py-2 text-xs text-center text-amber-400 hover:text-amber-300 hover:bg-slate-700/50 mt-1">View All Articles &rarr;</a>
                </div>
              </div>
`;

code = code.replace(
  /<a href="\/crypto\/binance-usdt-withdrawal-guide"[\s\S]*?Crypto<\/a>/,
  "$&" + '\n              ' + loanArticleLinks
);

fs.writeFileSync('src/components/Navbar.tsx', code, 'utf8');
console.log('Patched Navbar.tsx 2');
