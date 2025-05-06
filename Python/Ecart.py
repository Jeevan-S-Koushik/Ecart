import random
import re
import sys

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
    def __init__(self):
        self.users = {}
        self.products = {
            "P001": Product("P001", "Laptop", 45000),
            "P002": Product("P002", "Smartphone", 25000),
            "P003": Product("P003", "Headphones", 3000)
        }
        self.logged_in_user = None

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


if __name__ == "__main__":
    app = ECommerceApp()
    app.main_menu()
