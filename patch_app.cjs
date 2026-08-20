const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(
  "const CustomPageView = lazy(() => import('./components/CustomPageView').then(m => ({ default: m.CustomPageView })));",
  "const CustomPageView = lazy(() => import('./components/CustomPageView').then(m => ({ default: m.CustomPageView })));\nconst ArticlesHubPage = lazy(() => import('./components/ArticlesHubPage').then(m => ({ default: m.ArticlesHubPage })));"
);

// Add route
const hubRoute = `
  if (currentPath === '/articles') {
    return (
      <>
        <TopLoadingBar isLoading={isNavigating} />
        <Suspense fallback={<div className="min-h-screen pt-24"><AppSkeleton /></div>}><ArticlesHubPage customPages={customPages} platforms={platforms} config={config} /></Suspense>
        <Footer
          platforms={platforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }
`;

code = code.replace(
  "if (currentPath.startsWith('/brands/')) {",
  hubRoute + "\n  if (currentPath.startsWith('/brands/')) {"
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Patched App.tsx with ArticlesHubPage');
