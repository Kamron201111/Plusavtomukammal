#!/bin/bash
set -e

cd /var/www/html

echo "=== PlusAvto.Uz starting ==="

# .env ni production uchun yangilaymiz
sed -i 's/APP_ENV=local/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env

# APP_KEY
php artisan key:generate --force
echo "✓ APP_KEY generated"

# SQLite database fayl
touch database/database.sqlite
chmod 777 database/database.sqlite
echo "✓ SQLite ready"

# Migrate
php artisan migrate --force
echo "✓ Migrations done"

# Seed
php artisan db:seed --force
echo "✓ Seeding done"

# Storage link
php artisan storage:link --force 2>/dev/null || true
echo "✓ Storage linked"

# Cache tozalash va qayta yaratish
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
echo "✓ Cache ready"

echo "=== Starting Apache ==="
apache2-foreground
