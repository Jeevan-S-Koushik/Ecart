CREATE TABLE Customer (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    MobileNumber VARCHAR(15) NOT NULL,
    Password VARCHAR(30) NOT NULL,
    ConfirmPassword VARCHAR(30) NOT NULL,
    Address VARCHAR(300) NOT NULL
);
