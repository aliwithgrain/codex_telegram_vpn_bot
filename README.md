# codex_telegram_vpn_bot

ربات تلگرام برای فروش و مدیریت اشتراک VPN با 3x-ui

## پیش‌نیازها
- Ubuntu 24.04 (VPS)
- Node.js 20+
- npm
- Bot Token تلگرام (BotFather)
- دسترسی به پنل 3x-ui

## نصب و اجرا
### 1) نصب ابزارهای پایه
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ca-certificates
````

### 2) نصب Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 3) دریافت سورس

```bash
git clone https://github.com/aliwithgrain/codex_telegram_vpn_bot.git
cd codex_telegram_vpn_bot
```

### 4) نصب وابستگی‌ها

```bash
npm ci
# اگر خطا داد:
# npm install
```

### 5) ساخت/به‌روزرسانی .env

```bash
npm run setup
# اگر setup نبود:
# node src/setup.js
```

### 6) اجرای ربات

```bash
npm run start
# اگر start نبود:
# node src/index.js
```

## مدیریت پلن‌ها (CLI)

```bash
npm run plans -- list
npm run plans -- add pro-50gb "پلن پرو" 30 50 349000
npm run plans -- disable pro-50gb
npm run plans -- enable pro-50gb
npm run plans -- remove pro-50gb
npm run plans -- set-threshold 10
npm run plans -- set-expiry-warning 2
```

اگر اسکریپت `plans` نبود:

```bash
node src/manage-plans.js list
```

## اجرای دائمی با PM2 (پیشنهادی)

```bash
sudo npm i -g pm2
pm2 start npm --name telegram-vpn-bot -- run start
# اگر start نبود:
# pm2 start src/index.js --name telegram-vpn-bot
pm2 save
pm2 startup
pm2 logs telegram-vpn-bot
```

## Docker (اختیاری)

> باید `.env` ساخته شده باشد.

```bash
docker compose up -d --build
```

## فایل‌های مهم

* `src/index.js` اجرای ربات
* `src/setup.js` ویزارد ساخت `.env`
* `src/manage-plans.js` CLI پلن‌ها
* `config/runtime.config.json` تنظیمات پویا
* `.env.example` نمونه متغیرها
