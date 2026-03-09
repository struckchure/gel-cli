const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('CLI wrapper forwards args to binary through napi', () => {
  const script = path.resolve(__dirname, '../bin/gel.js');
  const fakeBinary = path.join(os.tmpdir(), `gel-cli-js-test-${process.pid}.sh`);

  fs.writeFileSync(
    fakeBinary,
    '#!/bin/sh\n[ "$1" = "--help" ] && [ "$2" = "query" ]\n',
    { mode: 0o755 },
  );

  try {
    const result = spawnSync(process.execPath, [script, '--help', 'query'], {
      env: {
        ...process.env,
        GEL_CLI_BINARY: fakeBinary,
      },
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
  } finally {
    fs.unlinkSync(fakeBinary);
  }
});
