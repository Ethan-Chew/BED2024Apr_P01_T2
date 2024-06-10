INSERT INTO Account(AccountId, AccountName, AccountPassword, AccountEmail, AccountCreationDate) VALUES
('ACC0001', 'User1', 'password1', 'user1@mail.com', 1718096320), 
('ACC0002', 'User2', 'password2', 'user2@mail.com', 1717839920),
('ACC0003', 'User3', 'password3', 'user3@mail.com', 1717773120),
('ACC0004', 'User4', 'password4', 'user4@mail.com', 1718361520),
('ACC0005', 'User5', 'password5', 'user5@mail.com', 1717607320), 
('ACC0006', 'User6', 'password6', 'user6@mail.com', 1718446720),
('ACC0007', 'User7', 'password7', 'user7@mail.com', 1717931520),
('ACC0008', 'User8', 'password8', 'user8@mail.com', 1717607320),
('ACC0009', 'User9', 'password9', 'user9@mail.com', 1718446720),
('ACC0010', 'User10', 'password10', 'user10@mail.com', 1717931520),
('ACC0011', 'User11', 'password11', 'user11@mail.com', 1717607320),
('ACC0012', 'User12', 'password12', 'user12@mail.com', 1718446720);

INSERT INTO Staff(StaffId) VALUES
('ACC0001'),
('ACC0002');

INSERT INTO Patient(PatientId, KnownAllergies, PatientBirthdate, PatientIsApproved) VALUES
('ACC0003', 'Pollen', 970365600, 'Declined'),
('ACC0004', 'Dust', 970365600, 'Pending'),
('ACC0005', 'Mold', 970365600, 'Approved'),
('ACC0006', 'Cats', 970365600, 'Declined'),
('ACC0007', 'Dogs', 970365600, 'Pending');

INSERT INTO Doctor(DoctorId, DoctorCreatedBy) VALUES
('ACC0008', 'ACC0001'),
('ACC0009', 'ACC0002');

INSERT INTO Company(CompanyId, CompanyCreatedBy, CompanyAddress) VALUES
('ACC0010', 'ACC0001', '1234 Main St'),
('ACC0011', 'ACC0002', '5678 Elm St');

INSERT INTO Questionnaire(QuestionnaireId, AccountId, QOne, QTwo, QThree, QFour, QFive, QSix) VALUES
('QES0001', 'ACC0003', 'Yes', '$75,000', 'No', 3, 'Own', 'No'),
('QES0002', 'ACC0004', 'No', 'N/A', 'Yes', 1, 'Rent', 'Yes'),
('QES0003', 'ACC0005', 'Maybe', '$50,000 - $75,000', 'Depends', 2, 'Rent', 'No'),
('QES0004', 'ACC0006', 'Full-time student', 'N/A', 'No', 1, 'Live with parents', 'N/A'),
('QES0005', 'ACC0007', 'Part-time', '$25,000 - $50,000', 'No', 0, 'Rent', 'No');

INSERT INTO AvailableSlot (SlotId, DoctorId, PatientId, SlotTime) VALUES
('SLO0001', 'ACC0008', NULL, '2024-06-15 09:00:00'),
('SLO0002', 'ACC0009', 'ACC0003', '2024-06-15 10:00:00');

INSERT INTO Appointments (AppointmentId, AccountId, DoctorId, SlotId, ConsultationCost, Reason, DoctorNote) VALUES
('APP0001', 'ACC0002', 'ACC0008', 'SLO0002', 50.00, 'Checkup', 'Recommend follow up'),
('APP0002', 'ACC0003', 'ACC0009', 'SLO0001', 60.00, 'Follow-up', NULL),
('APP0003', 'ACC0003', 'ACC0009', 'SLO0001', 60.00, 'Checkup', NULL);

INSERT INTO PaymentRequest (PaymentRequestId, AppointmentId, PaymentRequestMessage, PaymentRequestCreatedDate, PaymentRequestStatus) VALUES
('REQ0001', 'APP0001', 'Payment for appointment', '2024-06-01', 'Pending'),
('REQ0002', 'APP0002', 'Payment for follow-up', '2024-06-02', 'Completed');

INSERT INTO Payments (PaymentId, AppointmentId, PaymentAmount, PaymentStatus) VALUES
('PAY0001', 'APP0001', 50.00, 'Unpaid'),
('PAY0002', 'APP0002', 50.00, 'Unpaid'),
('PAY0003', 'APP0003', 60.00, 'Paid');

INSERT INTO DrugInventory(DrugName, DrugPrice, DrugDescription) VALUES
('Aspirin', 5.99, 'Pain relief'),
('Paracetamol', 5.99, 'Fever relief'),
('Ibuprofen', 7.99, 'Inflammation relief'),
('Panadol', 8.99, 'Pain relief'),
('Calcium Channel Blockers', 16.99, 'Lower blood pressure'),
('Tamoxifen', 7.99, 'Treatment for breast cancer'),
('​​Penicillamine', 7.99, 'Treatment for rheumatoid arthritis'),
('​Prazosin', 7.99, 'Treatment for hypertension'),
('​Magnesium Carbonate', 7.99, 'Reducing excessive acid in the stomach'),
('Promethazine', 7.99, 'Inflammation relief'),
('​Aciclovir', 7.99, 'Treatment for viral infections'),
('Clindamycin', 7.99, 'Treatment for viral infections'),
('Co-trimoxazole', 7.99, 'Treatment for bacterial infections'), 
('Metronidazole', 7.99, 'Treatment for gut infections'), 
('Benzydamine', 7.99, 'Pain relief for sore throat'),  
('Digoxin', 7.99, 'Treatment for heart failure'),  
('Dipyridamole', 7.99, 'Prevent blood clots'), 
('Pheniramine', 7.99, 'Pain relief for eyes'); 


INSERT INTO DrugInventoryRecord (DrugRecordId, DrugName, DrugExpiryDate, DrugAvailableQuantity, DrugTotalQuantity, DrugRecordEntryDate, CompanyId) VALUES
('DRI0001', 'Aspirin', '2024-12-31', 100, 200, '2024-01-01','ACC0010'),
('DRI0002', 'Ibuprofen', '2024-11-30', 150, 300, '2024-01-10','ACC0011'),
('DRI0003', 'Paracetemol', '2025-2-21', 150, 300, '2024-01-11','ACC0010'),
('DRI0004', 'Panadol', '2024-11-30', 150, 300, '2024-01-11','ACC0010'),
('DRI0005', 'Calcium Channel Blockers', '2024-11-30', 150, 300, '2024-01-12','ACC0010'),
('DRI0006', 'Tamoxifen', '2024-10-23', 150, 300, '2024-01-12','ACC0010'),
('DRI0007', 'Penicillamine', '2024-11-30', 150, 300, '2024-01-13','ACC0010'),
('DRI0008', 'Prazosin', '2024-11-30', 150, 300, '2024-01-13','ACC0010'),
('DRI0009', 'Magnesium Carbonate', '2024-11-30', 150, 300, '2024-01-14','ACC0010'),
('DRI0010', 'Promethazine', '2024-11-30', 150, 300, '2024-01-14''ACC0011'),
('DRI0011', 'Co-trimoxazole', '2024-11-30', 150, 300, '2024-01-15''ACC0011'), 
('DRI0012', 'Metronidazole', '2024-11-30', 150, 300, '2024-01-15''ACC0010'), 
('DRI0013', 'Benzydamine', '2024-11-30', 150, 300, '2024-01-16''ACC0011'), 
('DRI0014', 'Digoxin', '2024-11-30', 150, 300, '2024-01-16''ACC0010'), 
('DRI0015', 'Dipyridamole', '2024-11-30', 150, 300, '2024-01-17''ACC0011'), 
('DRI0016', 'Pheniramine', '2024-11-30', 150, 300, '2024-01-18''ACC0011'), 
('DRI0017', 'Aciclovir', '2024-11-30', 150, 300, '2024-01-19''ACC0011'); 

INSERT INTO PrescribedMedication (PrescribedMedId, AppointmentId, DrugName, Quantity, Price, Reason, DrugRequest) VALUES
('PRM0001', 'APP0001', 'Aspirin', 10, 59.90, 'Pain relief', 'Completed'),
('PRM0002', 'APP0002', 'Paracetamol', 10, 59.90, 'Fever', 'Completed'),
('PRM0003', 'APP0003', 'Ibuprofen', 5, 39.95, 'Inflammation', 'Pending');

INSERT INTO DrugTopupRequest (TopupId, DrugName, TopupQuantity, TopupRequestDate, TopupStatus) VALUES
('DRT0001', 'Paracetamol', 100, '2024-05-01', 'Completed'),
('DRT0002', 'Ibuprofen', 200, '2024-05-05', 'Pending');