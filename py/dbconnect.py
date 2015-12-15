#!/usr/bin/python
import MySQLdb

# connect
db = MySQLdb.connect(host="10.176.25.15", user="sabarish", passwd="checksabarish",
db="UIHP")

cursor = db.cursor()

# execute SQL select statement
cursor.execute("SELECT COUNT(1) FROM UIHP_FINAL_REPORT")

# commit your changes
db.commit()

# get the number of rows in the resultset
numrows = int(cursor.rowcount)

# get and display one row at a time.
for x in range(0,numrows):
    row = cursor.fetchone()
    print row[0], "-->", row[1]