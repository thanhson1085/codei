#!bin/bash

echo 'Starting...'
expected_args=3
e_badargs=65
home_dir=$PWD/../
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
 
if [ $# -ne $expected_args ]
then
	echo "Error: you should use command $0 version dbuser dbpass"
	exit $e_badargs
fi

chown -R www-data:www-data ../application/cache
chown -R www-data:www-data ../application/logs

cd $home_dir
echo "Running update source code from DEV branch..."
git pull origin master

cd application/config/
for config_file in *.staging
do
	echo "Genarating ${config_file%.*}..."
	cp $config_file ${config_file%.*}
done


cd $home_dir
database_name=${PWD##*/}

mysql -u$2 -p$3 -e "CREATE DATABASE IF NOT EXISTS $database_name"
echo "Backup Database $database_name..."
rm -f $home_dir/database-backups/*.sql
mysqldump -u$2 -p$3 $database_name > $home_dir/database-backups/$current_time.sql
cd database-schema
if [ -d $1 ]
then
	cd $1
	for schema_file in *.sql
	do
		echo "Running SQL Script $schema_file..."
		mysql -u$2 -p$3 $database_name < ${PWD}/$schema_file
	done
fi
echo 'DONE!!!'
