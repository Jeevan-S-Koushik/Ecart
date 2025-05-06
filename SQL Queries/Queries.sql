/* Write the SQL Query to display the details of the customer who have not placed any orders in below table format.
Customer id|Customer name|Email*/

SELECT 
    c.CustomerId,
    c.CustomerName,
    c.Email
FROM 
    Customer c
LEFT JOIN 
    Orders o ON c.CustomerId = o.CustomerId
WHERE 
    o.CustomerId IS NULL;

/* Write the SQL Query to find the average amount paid by the customer whose name ends with 'a'. */

SELECT 
    AVG(o.AmountPaid) AS AverageAmountPaid
FROM 
    Customer c
JOIN 
    Orders o ON c.CustomerId = o.CustomerId
WHERE 
    c.CustomerName LIKE '%a';


/*Write the SQL Query to display the details of the orders based on the order status(Confirmed, Delivered, Cancelled)in the ascending order of their product id.
If status is Confirmed:
Customer id| Order Id | Product id | Ordered date | Arriving date | Address */
SELECT 
    o.CustomerId,
    o.OrderId,
    o.ProductId,
    o.OrderedDate,
    o.ExpectedDate AS ArrivingDate,
    c.Address
FROM 
    Orders o
JOIN 
    Customer c ON o.CustomerId = c.CustomerId
WHERE 
    o.Status = 'Confirmed'
ORDER BY 
    o.ProductId ASC;


/*If status is Delivered:
Customer id| Order Id | Ordered item | Ordered date | Delivered date | Address */

SELECT 
    o.CustomerId,
    o.OrderId,
    p.ProductName AS OrderedItem,
    o.OrderedDate,
    o.DeliveredDate,
    c.Address
FROM 
    Orders o
JOIN 
    Customer c ON o.CustomerId = c.CustomerId
JOIN 
    Products p ON o.ProductId = p.ProductId
WHERE 
    o.Status = 'Delivered'
ORDER BY 
    o.ProductId ASC;


/* If status is Cancelled:
Customer id| Order Id | Ordered item | Ordered date | Cancelled date */

SELECT 
    o.CustomerId,
    o.OrderId,
    p.ProductName AS OrderedItem,
    o.OrderedDate,
    o.DeliveredDate AS CancelledDate
FROM 
    Orders o
JOIN 
    Products p ON o.ProductId = p.ProductId
WHERE 
    o.Status = 'Cancelled'
ORDER BY 
    o.ProductId ASC;

/* Write the SQL Query to display the  total amount of a product based(group by) on the category in the below format
Category | Total Amount */
SELECT 
    p.ProductCategory AS Category,
    SUM(o.AmountPaid) AS TotalAmount
FROM 
    Orders o
JOIN 
    Products p ON o.ProductId = p.ProductId
GROUP BY 
    p.ProductCategory;
