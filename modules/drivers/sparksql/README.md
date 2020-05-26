
Now sparksql driver can both support SparkSQL and Impala.
Database metadata of Impala syncs without issue.

Just choose Impala from `Database type` dropdown list in `ADD DATABASE` page which lets users build JDBC connection string.

Sample JDBC connection string:
```
# without authentication
jdbc:hive2://myhost.example.com:21050/;auth=noSasl

# with Kerberos authentication
jdbc:hive2://myhost.example.com:21050/;principal=impala/myhost.example.com@H2.EXAMPLE.COM
```

For more detailed information, please refer:

1. https://impala.apache.org/docs/build/html/topics/impala_jdbc.html
