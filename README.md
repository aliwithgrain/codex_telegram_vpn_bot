# codex_telegram_vpn_bot

ربات تلگرام فروش و مدیریت اشتراک VPN (3x-ui) با معماری قابل نصب چندباره روی سرورهای مختلف.

## پیش‌نیازها
- Ubuntu 24.04 (VPS)
- Node.js نسخه **20 یا بالاتر** (مطابق `engines.node` در `package.json`)
- npm
- یک ربات تلگرام (Bot Token)

## نصب کامل روی VPS (Ubuntu 24.04)

### 1) آپدیت سرور و نصب ابزارهای پایه
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ca-certificates
```

### 2) نصب Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

بررسی نسخه:
```bash
node -v
npm -v
```

### 3) دریافت سورس پروژه
```bash
git clone <YOUR_REPO_URL>
cd codex_telegram_vpn_bot
```

### 4) نصب وابستگی‌ها
```bash
npm install
```

### 5) اجرای wizard نصب (ساخت `.env`)
```bash
npm run setup
```

> اگر به هر دلیل اسکریپت `setup` در `package.json` وجود نداشت، همین دستور معادل را اجرا کنید:
```bash
node src/setup.js
```

### 6) اجرای ربات
```bash
npm run start
```

> اگر اسکریپت `start` وجود نداشت:
```bash
node src/index.js
```

---

## مدیریت پلن‌ها و اعلان‌ها

فرمان‌های CLI برای مدیریت سریع:
```bash
npm run plans -- list
npm run plans -- add pro-50gb "پلن پرو" 30 50 349000
npm run plans -- disable pro-50gb
npm run plans -- remove pro-50gb
npm run plans -- set-threshold 10
npm run plans -- set-expiry-warning 2
```

> اگر اسکریپت `plans` وجود نداشت:
```bash
node src/manage-plans.js list
node src/manage-plans.js add pro-50gb "پلن پرو" 30 50 349000
node src/manage-plans.js disable pro-50gb
node src/manage-plans.js remove pro-50gb
node src/manage-plans.js set-threshold 10
node src/manage-plans.js set-expiry-warning 2
```

---

## اجرای دائمی در VPS (پیشنهادی با PM2)

```bash
sudo npm i -g pm2
pm2 start src/index.js --name telegram-vpn-bot
pm2 save
pm2 startup
```

برای مشاهده لاگ:
```bash
pm2 logs telegram-vpn-bot
```

برای ری‌استارت:
```bash
pm2 restart telegram-vpn-bot
```

## Docker
```bash
docker compose up -d --build
```

> قبل از اجرای Docker باید `.env` موجود باشد (از طریق `npm run setup` یا `node src/setup.js`).

## نصب روی aaPanel
- یک Node.js Project بسازید.
- سورس ریپو را Deploy کنید.
- `npm install` را اجرا کنید.
- یک‌بار در ترمینال پروژه `npm run setup` (یا `node src/setup.js`) را اجرا کنید تا `.env` ساخته شود.
- Startup Command را `npm run start` (یا `node src/index.js`) قرار دهید.

## تنظیمات قابل ویرایش بعد از نصب
- فایل پیش‌فرض تنظیمات پویا:
  - `config/runtime.config.json`
- مثال ساختار:
  - `config/runtime.config.example.json`

مواردی که بعداً قابل ویرایش هستند:
- لیست پلن‌ها (افزودن/حذف/غیرفعال/فعال)
- درصد هشدار مصرف کم
- روز هشدار انقضا
- پیام‌های اعلان موفق/ناموفق
- تنظیمات نمایش و jobها

## فایل‌های مهم
- `PROJECT_SPEC_FA.md`: مشخصات نهایی محصول.
- `src/setup.js`: wizard نصب برای گرفتن اطلاعات هر سرور.
- `src/index.js`: اجرای ربات + بارگذاری تنظیمات پویا.
- `src/manage-plans.js`: مدیریت CLI برای پلن‌ها/آستانه اعلان.
- `src/lib/runtime-config.js`: loader/saver تنظیمات پویا.
- `.env.example`: نمونه کلیدهای env.
- `config/runtime.config.example.json`: نمونه کامل متغیرهای قابل تعریف.
