import random
import re
import sys
import sqlite3

class User:
    def __init__(self, customer_id, name, email, mobile, password, address):
        self.customer_id = customer_id
        self.name = name
        self.email = email
        self.mobile = mobile
        self.password = password
        self.address = address

class Customer(User):
    def __init__(self, customer_id, name, email, mobile, password, address):
        super().__init__(customer_id, name, email, mobile, password, address)
        self.orders = []

    def view_profile(self):
        print(f"\nCustomer ID: {self.customer_id}")
        print(f"Name: {self.name}")
        print(f"Email: {self.email}")
        update = input("Do you want to update your password? (yes/no): ").lower()
        if update == 'yes':
            self.update_password()

    def update_password(self):
        while True:
            new_password = input("Enter new password: ")
            if ECommerceApp.validate_password(new_password):
                self.password = new_password
                print("Password updated successfully.")
                # Update password in DB
                ECommerceApp.update_user_password(self.customer_id, new_password)
                break
            else:
                print("Invalid password format.")

class Product:
    def __init__(self, product_id, name, price):
        self.product_id = product_id
        self.name = name
        self.price = price

class Order:
    def __init__(self, order_id, product, amount):
        self.order_id = order_id
        self.product = product
        self.amount = amount

class ECommerceApp:
    DB_NAME = "ecommerce.db"

    def __init__(self):
        self.conn = sqlite3.connect(ECommerceApp.DB_NAME)
        self.cur = self.conn.cursor()
        self.create_tables()
        self.users = self.load_users_from_db()
        self.products = self.load_products_from_db()
        self.logged_in_user = None

        # If products table empty, add default products
        if not self.products:
            self.insert_default_products()
            self.products = self.load_products_from_db()

    def create_tables(self):
        # Create tables if they don't exist
        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            customer_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            mobile TEXT NOT NULL,
            password TEXT NOT NULL,
            address TEXT
        )
        """)
        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            product_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )
        """)
        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            order_id TEXT PRIMARY KEY,
            customer_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            amount REAL NOT NULL,
            FOREIGN KEY(customer_id) REFERENCES users(customer_id),
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )
        """)
        self.conn.commit()

    def load_users_from_db(self):
        users = {}
        self.cur.execute("SELECT * FROM users")
        rows = self.cur.fetchall()
        for row in rows:
            cust = Customer(*row)
            cust.orders = self.load_orders_for_user(cust.customer_id)
            users[cust.customer_id] = cust
        return users

    def load_products_from_db(self):
        products = {}
        self.cur.execute("SELECT * FROM products")
        rows = self.cur.fetchall()
        for row in rows:
            prod = Product(row[0], row[1], row[2])
            products[prod.product_id] = prod
        return products

    def load_orders_for_user(self, customer_id):
        orders = []
        self.cur.execute("SELECT order_id, product_id, amount FROM orders WHERE customer_id=?", (customer_id,))
        rows = self.cur.fetchall()
        for order_id, product_id, amount in rows:
            product = self.products.get(product_id)
            if product:
                orders.append(Order(order_id, product, amount))
        return orders

    def insert_default_products(self):
        default_products = [
            ("P001", "Laptop", 45000),
            ("P002", "Smartphone", 25000),
            ("P003", "Headphones", 3000)
        ]
        self.cur.executemany("INSERT OR IGNORE INTO products (product_id, name, price) VALUES (?, ?, ?)", default_products)
        self.conn.commit()

    def main_menu(self):
        while True:
            print("\nMain Menu:\n1) Register\n2) Login\n3) Exit")
            choice = input("Enter your choice: ")
            if choice == "1":
                self.register()
            elif choice == "2":
                self.login()
            elif choice == "3":
                print("Exiting application. Goodbye!")
                self.conn.close()
                sys.exit()
            else:
                print("Invalid choice. Try again.")

    def register(self):
        print("\n--- Register ---")
        name = input("Customer name: ")
        if not (3 <= len(name) <= 50):
            print("Name must be between 3 to 50 characters.")
            return

        email = input("Email: ")
        if '@' not in email:
            print("Invalid email format.")
            return

        mobile = input("Mobile number (10 digits): ")
        if not (mobile.isdigit() and len(mobile) == 10):
            print("Invalid mobile number.")
            return

        password = input("Password: ")
        if not self.validate_password(password):
            print("Password must include uppercase, lowercase and at least one alphabet.")
            return

        confirm_password = input("Confirm password: ")
        if password != confirm_password:
            print("Passwords do not match.")
            return

        address = input("Address: ")
        if len(address) > 300:
            print("Address too long.")
            return

        customer_id = str(random.randint(1000000, 9999999))
        # Save user to DB
        self.cur.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
                         (customer_id, name, email, mobile, password, address))
        self.conn.commit()

        # Add to local cache
        self.users[customer_id] = Customer(customer_id, name, email, mobile, password, address)

        print(f"\nRegistration successful!")
        print(f"Customer ID: {customer_id}")
        print(f"Email: {email}")
        print(f"Mobile: {mobile}")
        self.main_menu()

    def login(self):
        print("\n--- Login ---")
        customer_id = input("Customer ID: ")
        password = input("Password: ")

        user = self.users.get(customer_id)
        if user and user.password == password:
            self.logged_in_user = user
            print(f"\nWelcome, {user.name}!")
            self.customer_menu()
        else:
            print("Invalid credentials.")

    def customer_menu(self):
        while True:
            print("\nCustomer Menu:\n1) View Products\n2) Payment\n3) Previous Orders\n4) View Profile\n5) Logout")
            choice = input("Enter your choice: ")
            if choice == "1":
                self.view_products()
            elif choice == "2":
                self.make_payment()
            elif choice == "3":
                self.view_orders()
            elif choice == "4":
                self.logged_in_user.view_profile()
            elif choice == "5":
                self.logged_in_user = None
                print("Logged out successfully.")
                self.main_menu()
            else:
                print("Invalid choice.")

    def view_products(self):
        print("\n--- Products ---")
        for pid, prod in self.products.items():
            print(f"{pid}: {prod.name} - ₹{prod.price}")

    def make_payment(self):
        self.view_products()
        pid = input("Enter Product ID to buy: ")
        product = self.products.get(pid)
        if not product:
            print("Invalid product ID.")
            return

        tax = 0.18
        total_amount = round(product.price * (1 + tax), 2)
        print(f"Total amount with tax: ₹{total_amount}")

        print("\n--- Enter Payment Details ---")
        card_no = input("Card No (16 digits): ")
        if not (card_no.isdigit() and len(card_no) == 16):
            print("Invalid card number.")
            return

        card_holder = input("Card Holder Name (min 10 characters): ")
        if len(card_holder) < 10:
            print("Invalid name.")
            return

        expiry = input("Expiry Date (MM/YY): ")
        if not re.match(r"^(0[1-9]|1[0-2])\/\d{2}$", expiry):
            print("Invalid expiry date.")
            return

        cvv = input("CVV (3 digits): ")
        if not (cvv.isdigit() and len(cvv) == 3):
            print("Invalid CVV.")
            return

        order_id = str(random.randint(100000000000, 999999999999))
        order = Order(order_id, product, total_amount)
        self.logged_in_user.orders.append(order)

        # Save order to DB
        self.cur.execute("INSERT INTO orders VALUES (?, ?, ?, ?)",
                         (order_id, self.logged_in_user.customer_id, product.product_id, total_amount))
        self.conn.commit()

        print(f"\nPayment Successful!")
        print(f"Order ID: {order_id}")
        print(f"Amount Paid: ₹{total_amount}")

    def view_orders(self):
        print("\n--- Previous Orders ---")
        if not self.logged_in_user.orders:
            print("No orders yet.")
        else:
            for order in self.logged_in_user.orders:
                print(f"Order ID: {order.order_id}, Product: {order.product.name}, Amount: ₹{order.amount}")

    @staticmethod
    def validate_password(password):
        return (
            any(c.islower() for c in password) and
            any(c.isupper() for c in password) and
            any(c.isalpha() for c in password)
        )

    @staticmethod
    def update_user_password(customer_id, new_password):
        conn = sqlite3.connect(ECommerceApp.DB_NAME)
        cur = conn.cursor()
        cur.execute("UPDATE users SET password=? WHERE customer_id=?", (new_password, customer_id))
        conn.commit()
        conn.close()


if __name__ == "__main__":
    app = ECommerceApp()
    app.main_menu()
