const fs = require('fs');
const path = require('path');

const defaultConfigPath = path.resolve(process.cwd(), 'config', 'runtime.config.json');
const exampleConfigPath = path.resolve(process.cwd(), 'config', 'runtime.config.example.json');

function getConfigPath() {
  return process.env.RUNTIME_CONFIG_PATH
    ? path.resolve(process.cwd(), process.env.RUNTIME_CONFIG_PATH)
    : defaultConfigPath;
}

function ensureRuntimeConfigExists() {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    return configPath;
  }

  if (!fs.existsSync(exampleConfigPath)) {
    throw new Error('runtime.config.example.json پیدا نشد.');
  }

  fs.copyFileSync(exampleConfigPath, configPath);
  return configPath;
}

function loadRuntimeConfig() {
  const configPath = ensureRuntimeConfigExists();
  const raw = fs.readFileSync(configPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.plans) || parsed.plans.length === 0) {
    throw new Error('حداقل یک پلن باید در runtime config تعریف شده باشد.');
  }

  if (!parsed.notifications || typeof parsed.notifications.lowUsageThresholdPercent !== 'number') {
    throw new Error('notifications.lowUsageThresholdPercent نامعتبر است.');
  }

  return { configPath, config: parsed };
}

function saveRuntimeConfig(config, configPath = getConfigPath()) {
  const text = `${JSON.stringify(config, null, 2)}\n`;
  fs.writeFileSync(configPath, text, 'utf8');
}

module.exports = {
  getConfigPath,
  ensureRuntimeConfigExists,
  loadRuntimeConfig,
  saveRuntimeConfig
};
