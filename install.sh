#!/usr/bin/env bash
set -euo pipefail

REQUIRED_NODE_MAJOR=20

print_step() {
  echo
  echo "==> $1"
}

ensure_command() {
  local cmd="$1"
  local message="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "$message"
    exit 1
  fi
}

check_node_version() {
  local version major
  version="$(node -v | sed 's/^v//')"
  major="${version%%.*}"

  if [[ -z "$major" || "$major" -lt "$REQUIRED_NODE_MAJOR" ]]; then
    echo "❌ نسخه Node.js فعلی v$version است. نسخه موردنیاز: v$REQUIRED_NODE_MAJOR یا بالاتر."
    exit 1
  fi

  echo "✅ Node.js version: v$version"
}

install_dependencies() {
  if [[ -f package-lock.json ]]; then
    echo "در حال اجرای npm ci ..."
    if npm ci; then
      echo "✅ وابستگی‌ها با npm ci نصب شد."
      return
    fi

    echo "⚠️ npm ci ناموفق بود؛ تلاش با npm install ..."
  fi

  npm install
  echo "✅ وابستگی‌ها با npm install نصب شد."
}

main() {
  print_step "بررسی پیش‌نیازها"
  ensure_command node "❌ Node.js نصب نیست. ابتدا Node.js 20+ نصب کنید."
  ensure_command npm "❌ npm نصب نیست. ابتدا npm را نصب کنید."
  check_node_version

  print_step "نصب وابستگی‌ها"
  install_dependencies

  print_step "اجرای راه‌اندازی اولیه"
  npm run setup

  echo
  echo "🎉 نصب اولیه کامل شد."
  echo "برای اجرای ربات: npm run start"
  echo "برای بررسی پروژه: npm run check && npm test"
}

main "$@"
