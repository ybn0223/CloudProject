# Use the official PHP image with Apache
FROM php:7.4-apache

# Install required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy website files to the Apache document root
COPY ./src/. /var/www/html/

# Grant permissions to Apache
RUN chown -R www-data:www-data /var/www/html/

# Expose port 80
EXPOSE 80