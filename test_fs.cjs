const fs = require('fs');
async function test() {
  await fs.promises.writeFile('/tmp/test.json', '{}');
  console.log('fs.promises works');
}
test();
