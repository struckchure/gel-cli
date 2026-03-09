#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { run } = require('../index.js');

const binaryPath = process.env.GEL_CLI_BINARY || path.resolve(__dirname, '../dist/gel');

if (!fs.existsSync(binaryPath)) {
  console.error(
    `Missing bundled gel-cli binary at ${binaryPath}. Run \`npm run build:cli\` first.`,
  );
  process.exit(1);
}

const code = run(binaryPath, process.argv.slice(2));
process.exit(code);
