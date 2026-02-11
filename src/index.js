const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const { loadRuntimeConfig } = require('./lib/runtime-config');

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const requiredKeys = [
  'BOT_TOKEN',
  'ADMIN_TELEGRAM_ID',
  'SUPPORT_CHANNEL',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'PANEL_URL',
  'PANEL_USERNAME',
  'PANEL_PASSWORD'
];

function validateEnv() {
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ تنظیمات ناقص است.');
    console.error(`کلیدهای ناقص: ${missing.join(', ')}`);
    console.error('ابتدا دستور npm run setup را اجرا کنید.');
    process.exit(1);
  }
}

validateEnv();
const { config, configPath } = loadRuntimeConfig();

const enabledPlans = config.plans.filter((plan) => plan.enabled !== false);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    [
      '✅ هسته ربات اجرا شد.',
      `تعداد پلن فعال: ${enabledPlans.length}`,
      `آستانه هشدار مصرف: ${config.notifications.lowUsageThresholdPercent}%`,
      `هشدار انقضا: ${config.notifications.expiryWarningDays} روز قبل`,
      `فایل تنظیمات پویا: ${configPath}`,
      'برای تغییر پلن‌ها و اعلان‌ها بعداً از npm run plans استفاده کنید.'
    ].join('\n')
  );
});

bot.command('health', async (ctx) => {
  await ctx.reply('ok');
});

bot.command('plans', async (ctx) => {
  if (enabledPlans.length === 0) {
    await ctx.reply('هیچ پلن فعالی تعریف نشده است.');
    return;
  }

  const message = enabledPlans
    .map(
      (plan) =>
        `• ${plan.name}\n  ID: ${plan.id}\n  حجم: ${plan.quotaGb}GB\n  مدت: ${plan.durationDays} روز\n  قیمت: ${plan.priceToman} تومان`
    )
    .join('\n\n');

  await ctx.reply(message);
});

bot.launch();
console.log('🤖 Bot is running...');
console.log(`⚙️ Runtime config: ${configPath}`);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
