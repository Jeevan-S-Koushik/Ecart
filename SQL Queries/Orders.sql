INSERT INTO Orders (CustomerId, ProductId, OrderedDate, ExpectedDate, DeliveredDate, DeliveryStatus, AmountPaid, Status)
VALUES
(1, 101, '2025-05-01', '2025-05-05', '2025-05-04', 'Delivered', 999.99, 'Delivered'),
(2, 102, '2025-05-02', '2025-05-06', NULL, 'In Transit', 199.99, 'Confirmed'),
(3, 103, '2025-05-03', '2025-05-07', NULL, 'Pending', 5.99, 'Confirmed'),
(4, 104, '2025-05-04', '2025-05-08', NULL, 'Pending', 29.99, 'Confirmed'),
(5, 105, '2025-05-05', '2025-05-09', NULL, 'In Transit', 799.99, 'Confirmed'),
(6, 106, '2025-05-06', '2025-05-10', NULL, 'In Transit', 15.00, 'Confirmed'),
(7, 107, '2025-05-07', '2025-05-11', '2025-05-09', 'Delivered', 19.99, 'Delivered'),
(8, 108, '2025-05-08', '2025-05-12', NULL, 'Pending', 150.00, 'Confirmed'),
(9, 109, '2025-05-09', '2025-05-13', NULL, 'In Transit', 249.99, 'Confirmed'),
(10, 110, '2025-05-10', '2025-05-14', NULL, 'Pending', 12.50, 'Confirmed');