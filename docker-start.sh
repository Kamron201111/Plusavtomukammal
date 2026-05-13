#!/bin/bash
set -e

cd /var/www/html

echo "=== PlusAvto.Uz starting ==="

# .env ni production ga o'tkazamiz
sed -i 's/APP_ENV=local/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env

# APP_KEY mavjudligini tekshiramiz - faqat bo'sh bo'lsa generatsiya qilamiz
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate --force
    echo "✓ APP_KEY generated"
else
    echo "✓ APP_KEY already exists"
fi

# Cache tozalash - eski APP_KEY siz cache ni o'chiramiz
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
echo "✓ Cache cleared"

# SQLite database
touch database/database.sqlite
chmod 777 database/database.sqlite
echo "✓ SQLite ready"

# Migrate
php artisan migrate --force 2>&1 || true
echo "✓ Migrations done"

# Seed
php artisan db:seed --force 2>&1 || true
echo "✓ Seeding done"

# Storage link
php artisan storage:link --force 2>/dev/null || true
echo "✓ Storage linked"

# Yangi cache yaratamiz - APP_KEY bilan
php artisan config:cache
php artisan route:cache
echo "✓ Cache ready"

echo "=== APP_KEY tekshirish ==="
grep "APP_KEY=" .env | head -1

echo "=== Starting Apache ==="
apache2-foreground
