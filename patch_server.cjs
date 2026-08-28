const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace geoMatch.link.trim()
code = code.replace(/g\.link && g\.link\.trim\(\)/g, "typeof g.link === 'string' && g.link.trim()");
code = code.replace(/if \(geoMatch && geoMatch\.link && typeof geoMatch\.link === 'string' && geoMatch\.link\.trim\(\)\) {/g, "if (geoMatch && typeof geoMatch.link === 'string' && geoMatch.link.trim()) {");
code = code.replace(/if \(geoMatch && geoMatch\.link && geoMatch\.link\.trim\(\)\) {/g, "if (geoMatch && typeof geoMatch.link === 'string' && geoMatch.link.trim()) {");

// Replace platform.defaultLink.trim()
code = code.replace(/if \(platform\.defaultLink && platform\.defaultLink\.trim\(\)\) {/g, "if (typeof platform.defaultLink === 'string' && platform.defaultLink.trim()) {");
code = code.replace(/if \(platform\.rawAffiliateUrl && platform\.rawAffiliateUrl\.trim\(\)\) {/g, "if (typeof platform.rawAffiliateUrl === 'string' && platform.rawAffiliateUrl.trim()) {");
code = code.replace(/} else if \(platform\.rawAffiliateUrl && platform\.rawAffiliateUrl\.trim\(\)\) {/g, "} else if (typeof platform.rawAffiliateUrl === 'string' && platform.rawAffiliateUrl.trim()) {");

// Fix find for firstValid
code = code.replace(/const firstValid = platform\.geoLinks\.find\(g => typeof g\.link === 'string' && g\.link\.trim\(\)\);/g, "const firstValid = platform.geoLinks.find(g => typeof g.link === 'string' && g.link.trim());");

fs.writeFileSync('server.ts', code);
