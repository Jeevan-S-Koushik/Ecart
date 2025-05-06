CREATE TABLE Products (
    ProductId INT IDENTITY(101,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    ProductPrice FLOAT NOT NULL,
    ProductCategory VARCHAR(50) NOT NULL,
    ProductDescription VARCHAR(200)
);