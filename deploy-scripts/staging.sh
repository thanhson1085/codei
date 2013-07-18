#!bin/bash

echo 'Starting...'
chown -R www-data:www-data ../application/cache
chown -R www-data:www-data ../application/logs
echo 'DONE!!!'

