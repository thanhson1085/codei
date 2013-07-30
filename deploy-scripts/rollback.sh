#!bin/bash
home_dir=$PWD/../
expected_args=2
e_badargs=65
if [ $# -ne $expected_args ]
then
	echo "Error: you should use command $0 dbuser dbpass"
	exit $e_badargs
fi
cd $home_dir
database_name=${PWD##*/}
echo "Starting..."
echo "Rollback source code..."
git reset --hard HEAD@{1}
for backup_file in database-backups/*.sql
do
	echo "Rollback database $database_name..."
	mysql -u$1 -p$2 $database_name < $backup_file
done
echo "DONE!!!"
