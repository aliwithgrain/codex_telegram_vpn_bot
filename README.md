# codex_telegram_vpn_bot

ربات تلگرام فروش و مدیریت اشتراک VPN مبتنی بر 3x-ui</br>(نصب چندباره روی سرورهای مختلف و دارای تنظیمات مستقل)

---

# 🚀 سریع‌ترین روش اجرا

```bash
git clone https://github.com/aliwithgrain/codex_telegram_vpn_bot.git
cd codex_telegram_vpn_bot
npm install
npm run setup
npm run start
```

اگر `setup` یا `start` در دسترس نبود:

```bash
node src/setup.js
node src/index.js
```

برای دیدن اسکریپت‌های موجود:

```bash
npm run
```

---

# 📦 پیش‌نیازها

* Ubuntu 24.04 (پیشنهادی برای VPS)
* Node.js نسخه 20 یا بالاتر
* npm
* Bot Token از BotFather
* دسترسی به پنل 3x-ui

---

# 🛠 نصب کامل روی VPS (Ubuntu 24.04)

## 1) آپدیت سرور

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ca-certificates
```

## 2) نصب Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

بررسی نسخه:

```bash
node -v
npm -v
```

---

## 3) دریافت سورس

```bash
git clone https://github.com/aliwithgrain/codex_telegram_vpn_bot.git
cd codex_telegram_vpn_bot
```

---

## 4) نصب وابستگی‌ها

```bash
npm install
```

---

## 5) اجرای Wizard نصب (ساخت .env)

```bash
npm run setup
```

اگر اسکریپت setup در `package.json` وجود نداشت:

```bash
node src/setup.js
```

این مرحله:

* Bot Token را می‌گیرد
* اطلاعات پنل 3x-ui را می‌گیرد
* فایل `.env` را ایجاد می‌کند

---

## 6) اجرای ربات

```bash
npm run start
```

اگر اسکریپت start وجود نداشت:

```bash
node src/index.js
```

---

# ⚙ مدیریت پلن‌ها و اعلان‌ها (CLI)

## اگر script plans وجود دارد:

```bash
npm run plans -- list
npm run plans -- add pro-50gb "پلن پرو" 30 50 349000
npm run plans -- disable pro-50gb
npm run plans -- remove pro-50gb
npm run plans -- set-threshold 10
npm run plans -- set-expiry-warning 2
```

## اگر script plans وجود ندارد:

```bash
node src/manage-plans.js list
node src/manage-plans.js add pro-50gb "پلن پرو" 30 50 349000
node src/manage-plans.js disable pro-50gb
node src/manage-plans.js remove pro-50gb
node src/manage-plans.js set-threshold 10
node src/manage-plans.js set-expiry-warning 2
```

---

# 🔁 اجرای دائمی روی VPS (پیشنهادی با PM2)

نصب PM2:

```bash
sudo npm i -g pm2
```

اجرای ربات با اسکریپت npm (پیشنهادی):

```bash
pm2 start npm --name telegram-vpn-bot -- run start
```

اگر اسکریپت start نداشت:

```bash
pm2 start src/index.js --name telegram-vpn-bot
```

ذخیره تنظیمات:

```bash
pm2 save
pm2 startup
```

مشاهده لاگ:

```bash
pm2 logs telegram-vpn-bot
```

ری‌استارت:

```bash
pm2 restart telegram-vpn-bot
```

---

# 🐳 اجرای با Docker

پیش‌نیاز:

* Docker
* Docker Compose Plugin

اجرای پروژه:

```bash
docker compose up -d --build
```

⚠ قبل از اجرای Docker باید فایل `.env` ساخته شده باشد
(از طریق `npm run setup` یا `node src/setup.js`)

---

# 🧩 نصب روی aaPanel

1. یک Node.js Project بسازید
2. سورس ریپو را Deploy کنید
3. دستور `npm install` را اجرا کنید
4. یک‌بار `npm run setup` (یا `node src/setup.js`) را اجرا کنید
5. Startup Command را روی یکی از موارد زیر قرار دهید:

```
npm run start
```

یا

```
node src/index.js
```

---

# 📝 تنظیمات قابل ویرایش بعد از نصب

فایل تنظیمات پویا:

```
config/runtime.config.json
```

نمونه ساختار:

```
config/runtime.config.example.json
```

موارد قابل تغییر:

* لیست پلن‌ها
* درصد هشدار مصرف کم
* روز هشدار انقضا
* پیام‌های اعلان
* تنظیمات نمایش
* jobها

---

# 📂 فایل‌های مهم پروژه

* `PROJECT_SPEC_FA.md` → مشخصات کامل محصول
* `src/setup.js` → Wizard نصب
* `src/index.js` → اجرای ربات
* `src/manage-plans.js` → مدیریت CLI پلن‌ها
* `src/lib/runtime-config.js` → مدیریت تنظیمات پویا
* `.env.example` → نمونه متغیرهای محیطی
* `config/runtime.config.example.json` → نمونه تنظیمات پویا

---

# 💡 نکته مهم

برای مشاهده اسکریپت‌های موجود در پروژه:

```bash
npm run
```

اگر اسکریپتی وجود نداشت، همیشه می‌توانید فایل مربوطه را مستقیم با `node` اجرا کنید.

---
