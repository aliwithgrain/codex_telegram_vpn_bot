const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { loadRuntimeConfig, saveRuntimeConfig } = require('./lib/runtime-config');

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

function help() {
  console.log(`
استفاده:
  npm run plans -- list
  npm run plans -- add <id> <name> <days> <gb> <price>
  npm run plans -- remove <id>
  npm run plans -- disable <id>
  npm run plans -- enable <id>
  npm run plans -- set-threshold <percent>
  npm run plans -- set-expiry-warning <days>
`);
}

function findPlanIndex(plans, id) {
  return plans.findIndex((p) => p.id === id);
}

function parseNumber(value, fieldName) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} باید عدد باشد.`);
  }
  return parsed;
}

function list(config) {
  console.log('Plans:');
  config.plans.forEach((plan) => {
    console.log(
      `- ${plan.id} | ${plan.name} | ${plan.quotaGb}GB | ${plan.durationDays}d | ${plan.priceToman} تومان | enabled=${plan.enabled}`
    );
  });
  console.log(
    `\nthreshold=${config.notifications.lowUsageThresholdPercent}% | expiryWarning=${config.notifications.expiryWarningDays}d`
  );
}

function main() {
  const { config, configPath } = loadRuntimeConfig();
  const [, , command, ...args] = process.argv;

  if (!command) {
    help();
    process.exit(1);
  }

  if (command === 'list') {
    list(config);
    return;
  }

  if (command === 'add') {
    const [id, name, days, gb, price] = args;
    if (!id || !name || !days || !gb || !price) {
      throw new Error('برای add باید id name days gb price را بدهید.');
    }
    if (findPlanIndex(config.plans, id) >= 0) {
      throw new Error('این id قبلاً وجود دارد.');
    }
    config.plans.push({
      id,
      name,
      durationDays: parseNumber(days, 'days'),
      quotaGb: parseNumber(gb, 'gb'),
      priceToman: parseNumber(price, 'price'),
      isTest: false,
      enabled: true
    });
    saveRuntimeConfig(config, configPath);
    console.log(`✅ plan ${id} اضافه شد.`);
    return;
  }

  if (command === 'remove') {
    const [id] = args;
    const idx = findPlanIndex(config.plans, id);
    if (idx < 0) {
      throw new Error('plan پیدا نشد.');
    }
    if (config.plans.length <= 1) {
      throw new Error('حداقل یک plan باید باقی بماند. ابتدا یک plan جدید اضافه کنید.');
    }
    config.plans.splice(idx, 1);
    saveRuntimeConfig(config, configPath);
    console.log(`✅ plan ${id} حذف شد.`);
    return;
  }

  if (command === 'disable' || command === 'enable') {
    const [id] = args;
    const idx = findPlanIndex(config.plans, id);
    if (idx < 0) {
      throw new Error('plan پیدا نشد.');
    }
    config.plans[idx].enabled = command === 'enable';
    saveRuntimeConfig(config, configPath);
    console.log(`✅ plan ${id} -> enabled=${config.plans[idx].enabled}`);
    return;
  }

  if (command === 'set-threshold') {
    const [percent] = args;
    config.notifications.lowUsageThresholdPercent = parseNumber(percent, 'percent');
    saveRuntimeConfig(config, configPath);
    console.log('✅ درصد هشدار مصرف کم به‌روزرسانی شد.');
    return;
  }

  if (command === 'set-expiry-warning') {
    const [days] = args;
    config.notifications.expiryWarningDays = parseNumber(days, 'days');
    saveRuntimeConfig(config, configPath);
    console.log('✅ روز هشدار انقضا به‌روزرسانی شد.');
    return;
  }

  help();
  process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
