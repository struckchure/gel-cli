const fs = require('node:fs');
const path = require('node:path');

function loadBinding() {
  const candidates = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith('.node'))
    .map((file) => path.join(__dirname, file));

  if (candidates.length === 0) {
    throw new Error('No native napi-rs binding found. Run `npm run build` first.');
  }

  return require(candidates[0]);
}

module.exports = loadBinding();
