#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js نصب نیست. ابتدا Node.js 20+ نصب کنید."
  exit 1
fi

npm install
npm run setup

echo "نصب اولیه کامل شد. برای اجرا: npm start"
