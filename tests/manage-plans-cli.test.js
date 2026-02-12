const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function setupProjectFixture() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vpn-bot-cli-test-'));
  const configDir = path.join(tempRoot, 'config');
  fs.mkdirSync(configDir, { recursive: true });
  fs.copyFileSync(
    path.resolve(process.cwd(), 'config/runtime.config.example.json'),
    path.join(configDir, 'runtime.config.example.json')
  );
  return tempRoot;
}

function runPlans(tempRoot, args) {
  return execFileSync(process.execPath, [path.resolve(process.cwd(), 'src/manage-plans.js'), ...args], {
    cwd: tempRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      RUNTIME_CONFIG_PATH: 'config/runtime.config.json'
    }
  });
}

test('set-threshold rejects values greater than 100', () => {
  const tempRoot = setupProjectFixture();

  try {
    assert.throws(
      () => runPlans(tempRoot, ['set-threshold', '101']),
      /percent نباید بیشتر از 100 باشد/
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('add rejects negative quota', () => {
  const tempRoot = setupProjectFixture();

  try {
    assert.throws(
      () => runPlans(tempRoot, ['add', 'bad-plan', 'Bad', '30', '-10', '1000']),
      /gb نباید کمتر از 1 باشد/
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
