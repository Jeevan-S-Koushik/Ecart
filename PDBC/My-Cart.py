import mysql.connector
from mysql.connector import Error
from datetime import date

def create_connection():
    return mysql.connector.connect(
        host='localhost',
        database='ECart_Management_System',  # Change your DB name here
        user='root',              # Change your username here
        password=''  # Change your password here
    )

def create_tables(conn):
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS orders")
    cursor.execute("DROP TABLE IF EXISTS customer")

    create_customer = """
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

    create_orders = """
    CREATE TABLE orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        order_date DATE,
        amount_paid DECIMAL(10,2),
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    )
    """

    cursor.execute(create_customer)
    cursor.execute(create_orders)
    conn.commit()
    print("Tables created successfully.")

def insert_customers(conn):
    customers = [
        ("John Doe", "john@example.com", "1234567890", "john_doe", "pass123", "pass123", "123 Main St"),
        ("Jane Smith", "jane@example.com", "2345678901", "jane_smith", "pass234", "pass234", "456 Oak Ave"),
        ("Alice Johnson", "alice@example.com", "3456789012", "alice_j", "pass345", "pass345", "789 Pine Rd"),
        ("Bob Brown", "bob@example.com", "4567890123", "bob_brown", "pass456", "pass456", "321 Maple St"),
        ("Charlie Davis", "charlie@example.com", "5678901234", "charlie_d", "pass567", "pass567", "654 Elm St"),
    ]

    cursor = conn.cursor()
    insert_customer_sql = """
    INSERT INTO customer
    (customer_name, email, mobile_number, user_id, password, confirm_password, address)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    for customer in customers:
        cursor.execute(insert_customer_sql, customer)
        customer_id = cursor.lastrowid
        print(f"Customer Registration is successful - ID: {customer_id}, Name: {customer[0]}, Email: {customer[1]}")

    conn.commit()

def insert_orders(conn):
    # We'll assign orders to customers by their IDs 1 to 4 (assuming auto_increment starts at 1)
    orders = [
        (1, date(2025, 5, 10), 120.50),
        (1, date(2025, 5, 12), 80.00),
        (2, date(2025, 5, 13), 150.75),
        (2, date(2025, 5, 14), 210.10),
        (3, date(2025, 5, 15), 99.99),
        (3, date(2025, 5, 16), 199.99),
        (4, date(2025, 5, 17), 300.00),
        (4, date(2025, 5, 18), 450.00),
        (1, date(2025, 5, 19), 75.00),
        (3, date(2025, 5, 20), 500.00),
    ]

    cursor = conn.cursor()
    insert_order_sql = """
    INSERT INTO orders
    (customer_id, order_date, amount_paid)
    VALUES (%s, %s, %s)
    """

    for order in orders:
        cursor.execute(insert_order_sql, order)

    conn.commit()
    print("Orders inserted successfully.")

def main():
    try:
        conn = create_connection()
        if conn.is_connected():
            print("Connected to MySQL database")

            create_tables(conn)
            insert_customers(conn)
            insert_orders(conn)

    except Error as e:
        print("Error:", e)

    finally:
        if conn.is_connected():
            conn.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    main()
