const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

const target = `    } catch (err) {
      console.error('Failed to load initial affiliate data:', err);
      // Fallback to local data to prevent hanging skeleton on fetch failure
      setPlatforms(initialPlatforms);
      setConfig(initialGlobalConfig);
      setCustomPages(initialCustomPages);
    } finally {`;

const replacement = `    } catch (err) {
      console.error('Failed to load initial affiliate data:', err);
      // Removed fallback to prevent showing default data.
    } finally {`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Patched App.tsx successfully');
