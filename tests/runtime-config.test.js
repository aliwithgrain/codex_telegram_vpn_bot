const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { loadRuntimeConfig, saveRuntimeConfig } = require('../src/lib/runtime-config');

function withTempProject(run) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vpn-bot-test-'));
  const configDir = path.join(tempRoot, 'config');
  fs.mkdirSync(configDir, { recursive: true });
  fs.copyFileSync(
    path.resolve(process.cwd(), 'config/runtime.config.example.json'),
    path.join(configDir, 'runtime.config.example.json')
  );

  const previousCwd = process.cwd();
  const previousRuntimePath = process.env.RUNTIME_CONFIG_PATH;
  process.chdir(tempRoot);
  process.env.RUNTIME_CONFIG_PATH = 'config/runtime.config.json';

  try {
    run({ tempRoot });
  } finally {
    process.chdir(previousCwd);
    if (previousRuntimePath === undefined) {
      delete process.env.RUNTIME_CONFIG_PATH;
    } else {
      process.env.RUNTIME_CONFIG_PATH = previousRuntimePath;
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

test('loadRuntimeConfig creates runtime config when missing', () => {
  withTempProject(() => {
    const runtimePath = path.join(process.cwd(), 'config', 'runtime.config.json');
    assert.equal(fs.existsSync(runtimePath), false);

    const { configPath, config } = loadRuntimeConfig();

    assert.equal(configPath, runtimePath);
    assert.equal(fs.existsSync(runtimePath), true);
    assert.ok(Array.isArray(config.plans));
    assert.ok(config.plans.length > 0);
  });
});

test('saveRuntimeConfig rejects invalid threshold range', () => {
  withTempProject(() => {
    const { config, configPath } = loadRuntimeConfig();
    config.notifications.lowUsageThresholdPercent = 150;

    assert.throws(
      () => saveRuntimeConfig(config, configPath),
      /lowUsageThresholdPercent.*بیشتر از 100/
    );
  });
});

test('saveRuntimeConfig writes into nested custom path', () => {
  withTempProject(() => {
    const customPath = path.join(process.cwd(), 'nested', 'path', 'runtime.json');
    const { config } = loadRuntimeConfig();

    saveRuntimeConfig(config, customPath);

    assert.equal(fs.existsSync(customPath), true);
    const saved = JSON.parse(fs.readFileSync(customPath, 'utf8'));
    assert.equal(saved.notifications.lowUsageThresholdPercent, config.notifications.lowUsageThresholdPercent);
  });
});
