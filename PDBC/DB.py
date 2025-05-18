import mysql.connector

# Connect to MySQL server without specifying database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password=''
)

cursor = conn.cursor()
cursor.execute("CREATE DATABASE IF NOT EXISTS ecart_management_system")
print("Database created successfully.")

cursor.close()
conn.close()
