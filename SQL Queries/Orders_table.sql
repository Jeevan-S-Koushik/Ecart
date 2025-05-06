CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT,
    ProductId INT,
    OrderedDate DATE,
    ExpectedDate DATE,
    DeliveredDate DATE,
    DeliveryStatus VARCHAR(50),
    AmountPaid FLOAT,
    Status VARCHAR(20)
);
