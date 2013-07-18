#!bin/bash

echo 'Starting...'
expected_args=3
e_badargs=65
 
if [ $# -ne $expected_args ]
then
  echo "Error: you should use command $0 version dbuser dbpass"
  exit $e_badargs
fi

chown -R www-data:www-data ../application/cache
chown -R www-data:www-data ../application/logs
cd ../application/config/
for config_file in *.dist
do
	cp $config_file ${config_file%.*}
done


cd ../../
database_name=${PWD##*/}

cd database-schema
if [ -d $1 ]
then
	cd $1
	echo "Running SQL Script..."
	mysql -u$2 -p$3 -e "CREATE DATABASE IF NOT EXISTS $database_name"
	for schema_file in *.sql
	do
		mysql -u$2 -p$3 $database_name < ${PWD}/$schema_file
	done
fi
echo 'DONE!!!'
