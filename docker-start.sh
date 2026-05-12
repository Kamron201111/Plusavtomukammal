#!/bin/bash
set -e

cd /var/www/html

# APP_KEY generatsiya
php artisan key:generate --force

# Migrate va seed
php artisan migrate --seed --force

# Storage link
php artisan storage:link --force

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Apache ishga tushirish
apache2-foreground
