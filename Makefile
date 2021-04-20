run:
	MB_DB_TYPE=mysql \
	MB_DB_HOST=localhost \
	MB_DB_PORT=3306 \
	MB_DB_DBNAME=metabase \
	MB_DB_USER=root \
	MB_DB_PASS=root \
	lein run
