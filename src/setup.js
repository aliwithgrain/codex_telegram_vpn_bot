const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {
  ensureRuntimeConfigExists,
  loadRuntimeConfig,
  saveRuntimeConfig
} = require('./lib/runtime-config');

const envPath = path.resolve(process.cwd(), '.env');

const questions = [
  { key: 'BOT_TOKEN', label: 'توکن ربات تلگرام (BOT_TOKEN)', required: true },
  { key: 'ADMIN_TELEGRAM_ID', label: 'آیدی عددی ادمین اصلی (ADMIN_TELEGRAM_ID)', required: true },
  { key: 'SECOND_ADMIN_TELEGRAM_ID', label: 'آیدی عددی ادمین دوم (اختیاری)', required: false },
  { key: 'SUPPORT_CHANNEL', label: 'یوزرنیم یا آیدی کانال پشتیبانی', required: true },
  { key: 'DB_HOST', label: 'MySQL Host', required: true },
  { key: 'DB_PORT', label: 'MySQL Port', required: true, defaultValue: '3306' },
  { key: 'DB_NAME', label: 'MySQL Database Name', required: true },
  { key: 'DB_USER', label: 'MySQL Username', required: true },
  { key: 'DB_PASS', label: 'MySQL Password', required: true },
  { key: 'PANEL_URL', label: 'آدرس پنل 3x-ui (PANEL_URL)', required: true },
  { key: 'PANEL_USERNAME', label: 'نام کاربری پنل 3x-ui', required: true },
  { key: 'PANEL_PASSWORD', label: 'رمز پنل 3x-ui', required: true },
  { key: 'APP_TIMEZONE', label: 'Timezone اپلیکیشن', required: true, defaultValue: 'Asia/Tehran' }
];

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function ask(rl, text) {
  return new Promise((resolve) => rl.question(text, resolve));
}

function parseExistingEnv() {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const current = fs.readFileSync(envPath, 'utf8');
  return current
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=');
      acc[key] = valueParts.join('=');
      return acc;
    }, {});
}

function sanitizeEnvValue(value, key) {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.includes('\n') || value.includes('\r')) {
    throw new Error(`مقدار ${key} نباید شامل خط جدید باشد.`);
  }

  return value.trim();
}

async function askRequiredQuestion(rl, question, hintDefault) {
  while (true) {
    const hint = hintDefault ? ` [پیش‌فرض: ${hintDefault}]` : '';
    // eslint-disable-next-line no-await-in-loop
    const raw = await ask(rl, `${question.label}${hint}: `);
    const value = sanitizeEnvValue(raw.trim() || hintDefault, question.key);

    if (question.required && !value) {
      console.log('این مقدار اجباری است. دوباره تلاش کنید.');
      continue;
    }

    return value;
  }
}

async function maybeUpdateRuntimeConfig(rl) {
  const configPath = ensureRuntimeConfigExists();
  const { config } = loadRuntimeConfig();

  console.log(`\n📦 مسیر تنظیمات قابل ویرایش: ${configPath}`);
  console.log('پلن‌ها، درصد اعلان‌ها و تنظیمات قابل تغییر بعدی در این فایل هستند.');

  const currentThreshold = config.notifications.lowUsageThresholdPercent;
  const currentExpiry = config.notifications.expiryWarningDays;
  const plansCount = config.plans.length;

  // eslint-disable-next-line no-await-in-loop
  const shouldEdit = (await ask(
    rl,
    `می‌خواهید همین الان تنظیمات runtime را ویرایش کنید؟ [y/N] `
  ))
    .trim()
    .toLowerCase();

  if (shouldEdit !== 'y' && shouldEdit !== 'yes') {
    return;
  }

  // eslint-disable-next-line no-await-in-loop
  const thresholdInput = await ask(
    rl,
    `درصد هشدار مصرف کم (فعلی: ${currentThreshold}): `
  );
  const thresholdValue = Number(thresholdInput.trim() || currentThreshold);
  if (!Number.isNaN(thresholdValue)) {
    config.notifications.lowUsageThresholdPercent = thresholdValue;
  }

  // eslint-disable-next-line no-await-in-loop
  const expiryInput = await ask(
    rl,
    `هشدار انقضا چند روز قبل ارسال شود؟ (فعلی: ${currentExpiry}): `
  );
  const expiryValue = Number(expiryInput.trim() || currentExpiry);
  if (!Number.isNaN(expiryValue)) {
    config.notifications.expiryWarningDays = expiryValue;
  }

  console.log(`تعداد پلن‌های فعلی: ${plansCount}`);
  console.log('برای اضافه/حذف/جایگزینی پلن‌ها بعداً از دستور npm run plans استفاده کنید.');

  saveRuntimeConfig(config, configPath);
  console.log('✅ runtime config به‌روزرسانی شد.');
}

async function main() {
  const rl = createInterface();

  try {
    const existing = parseExistingEnv();
    const answers = {};

    console.log('\n=== راه‌اندازی اولیه ربات ===');
    console.log('این پروژه برای نصب چندباره روی سرورهای مختلف طراحی شده است.');
    console.log('در پایان، فایل .env برای همین سرور ساخته/به‌روزرسانی می‌شود.\n');

    for (const question of questions) {
      const existingValue = existing[question.key] || '';
      const hintDefault = existingValue || question.defaultValue || '';
      // eslint-disable-next-line no-await-in-loop
      answers[question.key] = await askRequiredQuestion(rl, question, hintDefault);
    }

    answers.RUNTIME_CONFIG_PATH = sanitizeEnvValue(
      existing.RUNTIME_CONFIG_PATH || 'config/runtime.config.json',
      'RUNTIME_CONFIG_PATH'
    );

    const lines = [
      '# Generated by setup wizard',
      '# Do not commit this file',
      ...Object.entries({ ...existing, ...answers }).map(([key, value]) => `${key}=${sanitizeEnvValue(value, key)}`)
    ];

    fs.writeFileSync(envPath, `${lines.join('\n')}\n`, 'utf8');

    await maybeUpdateRuntimeConfig(rl);

    console.log(`\n✅ فایل .env در مسیر ${envPath} ذخیره شد.`);
    console.log('✅ ربات قابل اجرا است و تنظیمات پلن‌ها بعداً قابل ویرایش می‌ماند.');
    console.log('حالا می‌توانید ربات را با npm start اجرا کنید.');
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error('❌ خطا در راه‌اندازی:', error.message);
  process.exit(1);
});
