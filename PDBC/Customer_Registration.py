import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            database='ecart_management_system',  # Make sure this database exists
            user='root',
            password=''  # change this
        )
        if conn.is_connected():
            print("Connected to MySQL database")
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None

def create_table(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("DROP TABLE IF EXISTS customer")
        create_table_query = """
        CREATE TABLE customer (
            customer_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            mobile_number VARCHAR(15),
            user_id VARCHAR(20) NOT NULL,
            password VARCHAR(30) NOT NULL,
            confirm_password VARCHAR(30) NOT NULL,
            address VARCHAR(200)
        )
        """
        cursor.execute(create_table_query)
        print("Customer table created successfully.")
    except Error as e:
        print(f"Error creating table: {e}")

def insert_customers(conn):
    customers = [
        ("John Doe", "john@example.com", "1234567890", "john_doe", "pass123", "pass123", "123 Main St"),
        ("Jane Smith", "jane@example.com", "2345678901", "jane_smith", "pass234", "pass234", "456 Oak Ave"),
        ("Alice Johnson", "alice@example.com", "3456789012", "alice_j", "pass345", "pass345", "789 Pine Rd"),
        ("Bob Brown", "bob@example.com", "4567890123", "bob_brown", "pass456", "pass456", "321 Maple St"),
        ("Charlie Davis", "charlie@example.com", "5678901234", "charlie_d", "pass567", "pass567", "654 Elm St")
    ]
    try:
        cursor = conn.cursor()
        insert_query = """
        INSERT INTO customer (customer_name, email, mobile_number, user_id, password, confirm_password, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        for c in customers:
            cursor.execute(insert_query, c)
            conn.commit()
            # Get last inserted ID
            customer_id = cursor.lastrowid
            print(f"Customer Registration is successful - ID: {customer_id}, Name: {c[0]}, Email: {c[1]}")

    except Error as e:
        print(f"Error inserting customers: {e}")

def main():
    conn = create_connection()
    if conn is not None:
        create_table(conn)
        insert_customers(conn)
        conn.close()

if __name__ == "__main__":
    main()
