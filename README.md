# codex_telegram_vpn_bot

ربات تلگرام فروش و مدیریت اشتراک VPN (3x-ui) با معماری قابل نصب چندباره روی سرورهای مختلف.

## هدف این نسخه
- هسته اجرا (`npm start`) همیشه ثابت و قابل استقرار است.
- تنظیمات قابل تغییر (پلن‌ها، درصد اعلان، قوانین متغیر) در فایل runtime config نگه داشته می‌شوند.
- بنابراین بعداً می‌توانید بدون تغییر کد، سرویس‌ها را حذف/اضافه/جایگزین کنید.

## اجرای سریع روی هر سرور جدید
1. نصب Node.js 20+
2. نصب وابستگی‌ها:
   ```bash
   npm install
   ```
3. اجرای wizard نصب:
   ```bash
   npm run setup
   ```
   این دستور اطلاعات ادمین/توکن/DB/پنل را می‌گیرد و `.env` را می‌سازد.
4. اجرای ربات:
   ```bash
   npm start
   ```

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

### مدیریت سریع پلن‌ها و اعلان‌ها (بدون ویرایش دستی)
```bash
npm run plans -- list
npm run plans -- add pro-50gb "پلن پرو" 30 50 349000
npm run plans -- disable pro-50gb
npm run plans -- remove pro-50gb
npm run plans -- set-threshold 10
npm run plans -- set-expiry-warning 2
```


## بازبینی ایمنی تنظیمات (Risk Fixes)
در این نسخه برای کاهش ریسک خطای پیکربندی:
- روی `runtime.config.json` اعتبارسنجی سخت‌گیرانه انجام می‌شود (مقادیر عددی معتبر، بازه درصد 0 تا 100، شناسه پلن تکراری نباشد).
- ذخیره `runtime.config.json` به‌صورت اتمیک انجام می‌شود تا فایل ناقص نوشته نشود.
- wizard فایل `.env` ورودی‌های چندخطی را رد می‌کند تا ساختار env خراب نشود.

برای بررسی سریع صحت تنظیمات:
```bash
npm run check
npm test
npm run plans -- list
```

## Docker
```bash
docker compose up -d --build
```
> قبل از اجرای Docker باید `.env` موجود باشد (از طریق `npm run setup`).

## نصب روی aaPanel
- یک Node.js Project بسازید.
- سورس ریپو را Deploy کنید.
- `npm install` را اجرا کنید.
- یک‌بار در ترمینال پروژه `npm run setup` بزنید تا `.env` ساخته شود.
- Startup Command را `npm start` قرار دهید.

## فایل‌های مهم
- `PROJECT_SPEC_FA.md`: مشخصات نهایی محصول.
- `src/setup.js`: wizard نصب برای گرفتن اطلاعات هر سرور.
- `src/index.js`: اجرای ربات + بارگذاری تنظیمات پویا.
- `src/manage-plans.js`: مدیریت CLI برای پلن‌ها/آستانه اعلان.
- `src/lib/runtime-config.js`: loader/saver تنظیمات پویا.
- `.env.example`: نمونه کلیدهای env.
- `config/runtime.config.example.json`: نمونه کامل متغیرهای قابل تعریف.
