const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const helperFn = `
// Resolve the best available link for a platform based on country code
function resolvePlatformLink(platform: any, countryCode: string): string {
  let finalLink = '';
  
  if (platform.geoLinks && Array.isArray(platform.geoLinks)) {
    const match = platform.geoLinks.find((g: any) => g && typeof g.country === 'string' && g.country.toUpperCase() === countryCode);
    if (match && typeof match.link === 'string' && match.link.trim()) {
      finalLink = match.link.trim();
    }
  }
  
  if (!finalLink) {
    if (typeof platform.defaultLink === 'string' && platform.defaultLink.trim()) {
      finalLink = platform.defaultLink.trim();
    } else if (typeof platform.rawAffiliateUrl === 'string' && platform.rawAffiliateUrl.trim()) {
      finalLink = platform.rawAffiliateUrl.trim();
    }
  }
  
  if (!finalLink && platform.geoLinks && Array.isArray(platform.geoLinks) && platform.geoLinks.length > 0) {
    const firstValid = platform.geoLinks.find((g: any) => typeof g.link === 'string' && g.link.trim());
    if (firstValid) finalLink = firstValid.link.trim();
  }
  
  return finalLink;
}

// Geo-Targeting & Link Routing Logic
`.trim();

code = code.replace('// Geo-Targeting & Link Routing Logic', helperFn);

const getFilteredOld = `
  }).map(p => {
    let finalLink = '';
    
    // Priority 1: Match visitor's country from geoLinks
    if (p.geoLinks && Array.isArray(p.geoLinks)) {
      const match = p.geoLinks.find(g => g && typeof g.country === 'string' && g.country.toUpperCase() === countryCode);
      if (match && typeof match.link === 'string' && match.link.trim()) {
        finalLink = match.link.trim();
      }
    }
    
    // Priority 2: Default / Global Link
    if (!finalLink) {
      if (typeof p.defaultLink === 'string' && p.defaultLink.trim()) {
        finalLink = p.defaultLink.trim();
      } else if (typeof p.rawAffiliateUrl === 'string' && p.rawAffiliateUrl.trim()) {
        finalLink = p.rawAffiliateUrl.trim();
      }
    }

    // Priority 3: First available geo link
    if (!finalLink && p.geoLinks && Array.isArray(p.geoLinks) && p.geoLinks.length > 0) {
      const firstValid = p.geoLinks.find(g => typeof g.link === 'string' && g.link.trim());
      if (firstValid) finalLink = firstValid.link.trim();
    }
`;

const getFilteredNew = `
  }).map(p => {
    let finalLink = resolvePlatformLink(p, countryCode);
`;

code = code.replace(getFilteredOld.trim(), getFilteredNew.trim());

const goRouteOld = `
  // Resolve country-specific link first, then default/fallback link
  let targetUrl = '';
  if (platform.geoLinks && Array.isArray(platform.geoLinks)) {
    const geoMatch = platform.geoLinks.find(g => g && typeof g.country === 'string' && g.country.toUpperCase() === countryCode);
    if (geoMatch && typeof geoMatch.link === 'string' && geoMatch.link.trim()) {
      targetUrl = geoMatch.link.trim();
    }
  }

  if (!targetUrl) {
    if (typeof platform.defaultLink === 'string' && platform.defaultLink.trim()) {
      targetUrl = platform.defaultLink.trim();
    } else if (typeof platform.rawAffiliateUrl === 'string' && platform.rawAffiliateUrl.trim()) {
      targetUrl = platform.rawAffiliateUrl.trim();
    }
  }

  // Fallback to first available geo link if no default is present (e.g. India-only platform accessed by proxy)
  if (!targetUrl && platform.geoLinks && Array.isArray(platform.geoLinks) && platform.geoLinks.length > 0) {
    const firstValid = platform.geoLinks.find(g => typeof g.link === 'string' && g.link.trim());
    if (firstValid) targetUrl = firstValid.link.trim();
  }

  if (!targetUrl) {
    targetUrl = '/';
  }
`;

const goRouteNew = `
  // Resolve country-specific link first, gracefully falling back to global/default
  let targetUrl = resolvePlatformLink(platform, countryCode);

  if (!targetUrl) {
    targetUrl = '/';
  }
`;

code = code.replace(goRouteOld.trim(), goRouteNew.trim());

fs.writeFileSync('server.ts', code);
