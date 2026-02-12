# codex_telegram_vpn_bot

ربات تلگرام فروش و مدیریت اشتراک VPN (3x-ui) با معماری قابل‌نصب مجدد روی چند سرور.

## قابلیت‌ها
- راه‌اندازی سریع با ویزارد `npm run setup` برای ساخت/به‌روزرسانی `.env`.
- فایل تنظیمات پویا (`runtime.config.json`) برای مدیریت پلن‌ها و اعلان‌ها بدون تغییر کد.
- CLI مدیریت پلن‌ها (`npm run plans -- ...`) برای افزودن/حذف/فعال‌سازی پلن‌ها.
- اعتبارسنجی ورودی‌ها در زمان اجرا برای جلوگیری از کانفیگ‌های ناسالم.

## پیش‌نیازها
- Ubuntu 24.04 (پیشنهادی)
- Node.js نسخه `20+`
- npm
- Bot Token تلگرام
- دسترسی به پنل 3x-ui
- (اختیاری) MySQL در صورت استفاده از تنظیمات DB

---

## نصب مرحله‌به‌مرحله روی VPS

### 1) به‌روزرسانی سیستم و نصب ابزارهای پایه
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ca-certificates
```

### 2) نصب Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3) بررسی نسخه Node و npm
```bash
node -v
npm -v
```
> نسخه Node باید 20 یا بالاتر باشد.

### 4) کلون پروژه
```bash
git clone <YOUR_REPO_URL>
cd codex_telegram_vpn_bot
```

### 5) نصب وابستگی‌ها
```bash
npm ci
```
> اگر `npm ci` خطا داد (مثلاً lock file ناسازگار بود)، از `npm install` استفاده کنید.

### 6) اجرای ویزارد راه‌اندازی
```bash
npm run setup
```
این مرحله موارد زیر را انجام می‌دهد:
- گرفتن مقادیر `.env` (توکن، ادمین، DB، پنل 3x-ui و ...)
- ایجاد/به‌روزرسانی فایل `config/runtime.config.json` بر اساس فایل نمونه
- امکان تنظیم سریع آستانه اعلان مصرف و اعلان انقضا

### 7) بررسی صحت سینتکس و تست‌ها
```bash
npm run check
npm test
```

### 8) اجرای ربات
```bash
npm run start
```

---

## راهنمای نصب سریع با اسکریپت
برای نصب سریع، اسکریپت آماده وجود دارد:
```bash
bash install.sh
```
این اسکریپت:
- Node.js و npm را چک می‌کند.
- نسخه Node را (20+) اعتبارسنجی می‌کند.
- وابستگی‌ها را نصب می‌کند (`npm ci` و fallback به `npm install`).
- ویزارد setup را اجرا می‌کند.

---

## مدیریت پلن‌ها و اعلان‌ها (CLI)

### نمایش وضعیت
```bash
npm run plans -- list
```

### افزودن پلن
```bash
npm run plans -- add pro-50gb "پلن پرو" 30 50 349000
```

### غیرفعال/فعال‌کردن پلن
```bash
npm run plans -- disable pro-50gb
npm run plans -- enable pro-50gb
```

### حذف پلن
```bash
npm run plans -- remove pro-50gb
```
> حذف آخرین پلن فعال/موجود مجاز نیست.

### تغییر آستانه اعلان‌ها
```bash
npm run plans -- set-threshold 10
npm run plans -- set-expiry-warning 2
```

---

## اجرای دائمی با PM2 (پیشنهادی)
```bash
sudo npm i -g pm2
pm2 start src/index.js --name telegram-vpn-bot
pm2 save
pm2 startup
```

### دستورات کاربردی PM2
```bash
pm2 logs telegram-vpn-bot
pm2 restart telegram-vpn-bot
pm2 status
```

---

## اجرای Docker
```bash
docker compose up -d --build
```

نکات:
- قبل از اجرای Docker فایل `.env` باید ساخته شده باشد.
- در صورت تغییر کانفیگ، کانتینر را بازسازی کنید.

---

## نصب روی aaPanel
1. یک **Node.js Project** بسازید.
2. سورس ریپو را Deploy کنید.
3. در ترمینال پروژه `npm ci` اجرا کنید.
4. یک‌بار `npm run setup` اجرا کنید تا `.env` و runtime config تنظیم شود.
5. Startup Command را `npm run start` قرار دهید.

---

## فایل‌های کلیدی پروژه
- `src/index.js`: نقطه شروع ربات
- `src/setup.js`: ویزارد راه‌اندازی و تولید `.env`
- `src/manage-plans.js`: CLI مدیریت پلن‌ها و اعلان‌ها
- `src/lib/runtime-config.js`: بارگذاری/اعتبارسنجی/ذخیره runtime config
- `.env.example`: نمونه متغیرهای محیطی
- `config/runtime.config.example.json`: نمونه کامل تنظیمات پویا
- `install.sh`: نصب سریع نیمه‌خودکار
- `PROJECT_SPEC_FA.md`: مشخصات محصول

---

## چک‌لیست بازبینی بعد از مرج (پیشنهادی)
بعد از هر مرج این‌ها را اجرا کنید تا ناسازگاری سریع مشخص شود:
```bash
git log --oneline --decorate -n 15
npm run check
npm test
```

اگر CI/CD دارید، همین سه مرحله را به‌عنوان گیت CI Gate قرار دهید.
