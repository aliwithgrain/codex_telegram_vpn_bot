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
  fs.mkdirSync(path.dirname(configPath), { recursive: true });

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

  validateRuntimeConfig(parsed);

  return { configPath, config: parsed };
}

function ensureFiniteNumber(value, fieldName, { min, max } = {}) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${fieldName} باید عدد معتبر باشد.`);
  }

  if (typeof min === 'number' && value < min) {
    throw new Error(`${fieldName} نباید کمتر از ${min} باشد.`);
  }

  if (typeof max === 'number' && value > max) {
    throw new Error(`${fieldName} نباید بیشتر از ${max} باشد.`);
  }
}

function validateRuntimeConfig(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('runtime config نامعتبر است.');
  }

  if (!Array.isArray(parsed.plans) || parsed.plans.length === 0) {
    throw new Error('حداقل یک پلن باید در runtime config تعریف شده باشد.');
  }

  const planIds = new Set();
  parsed.plans.forEach((plan, index) => {
    const prefix = `plans[${index}]`;
    if (!plan || typeof plan !== 'object') {
      throw new Error(`${prefix} نامعتبر است.`);
    }
    if (!plan.id || typeof plan.id !== 'string') {
      throw new Error(`${prefix}.id اجباری است.`);
    }
    if (planIds.has(plan.id)) {
      throw new Error(`id تکراری برای پلن‌ها مجاز نیست: ${plan.id}`);
    }
    planIds.add(plan.id);
    if (!plan.name || typeof plan.name !== 'string') {
      throw new Error(`${prefix}.name اجباری است.`);
    }

    ensureFiniteNumber(plan.durationDays, `${prefix}.durationDays`, { min: 1 });
    ensureFiniteNumber(plan.quotaGb, `${prefix}.quotaGb`, { min: 1 });
    ensureFiniteNumber(plan.priceToman, `${prefix}.priceToman`, { min: 0 });
  });

  if (!parsed.notifications || typeof parsed.notifications.lowUsageThresholdPercent !== 'number') {
    throw new Error('notifications.lowUsageThresholdPercent نامعتبر است.');
  }

  ensureFiniteNumber(
    parsed.notifications.lowUsageThresholdPercent,
    'notifications.lowUsageThresholdPercent',
    { min: 0, max: 100 }
  );
  ensureFiniteNumber(parsed.notifications.expiryWarningDays, 'notifications.expiryWarningDays', {
    min: 0
  });
}

function saveRuntimeConfig(config, configPath = getConfigPath()) {
  validateRuntimeConfig(config);
  const text = `${JSON.stringify(config, null, 2)}\n`;
  const tmpPath = `${configPath}.tmp`;
  fs.writeFileSync(tmpPath, text, 'utf8');
  fs.renameSync(tmpPath, configPath);
}

module.exports = {
  getConfigPath,
  ensureRuntimeConfigExists,
  loadRuntimeConfig,
  saveRuntimeConfig
};
