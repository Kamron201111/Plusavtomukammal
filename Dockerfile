FROM php:8.2-apache

# PHP kengaytmalari
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev \
    libonig-dev libxml2-dev libsqlite3-dev nodejs npm \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite \
       mbstring zip exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Apache sozlamalari
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf \
    && a2enmod rewrite

WORKDIR /var/www/html

# Fayllarni ko'chiramiz
COPY . .

# .env yaratamiz
RUN cp .env.example .env

# Cache papkalarini yaratamiz va ruxsat beramiz
RUN mkdir -p bootstrap/cache storage/framework/cache \
    storage/framework/sessions storage/framework/views \
    storage/logs \
    && chmod -R 777 bootstrap/cache storage

# Composer paketlari
RUN composer install --no-dev --optimize-autoloader --no-interaction

# NPM va frontend build
RUN npm ci && npm run build

# SQLite database
RUN touch database/database.sqlite && chmod 777 database/database.sqlite

# Umumiy ruxsatlar
RUN chown -R www-data:www-data /var/www/html

# Start scripti
COPY docker-start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80
CMD ["/usr/local/bin/start.sh"]
