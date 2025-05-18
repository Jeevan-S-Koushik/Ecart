import mysql.connector

def create_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="ECart_Management_System"
    )

def search_order_by_id(conn, order_id):
    cursor = conn.cursor()
    # This SQL joins orders with customer to get details together
    query = """
    SELECT o.order_id, o.order_date, o.amount_paid,
           c.customer_id, c.customer_name, c.email
    FROM orders o
    JOIN customer c ON o.customer_id = c.customer_id
    WHERE o.order_id = %s
    """
    cursor.execute(query, (order_id,))
    result = cursor.fetchone()

    if result:
        print(f"Order ID: {result[0]}")
        print(f"Order Date: {result[1]}")
        print(f"Amount Paid: ${result[2]:.2f}")
        print(f"Customer ID: {result[3]}")
        print(f"Customer Name: {result[4]}")
        print(f"Customer Email: {result[5]}")
    else:
        print("No Such Customer Exist with the Given order Id.")

if __name__ == "__main__":
    conn = create_connection()
    order_id = int(input("Enter Order ID to search: "))
    search_order_by_id(conn, order_id)
    conn.close()
