USE CareLinc;

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
('ACC0003', 'Pollen', '2000-01-01', 'Declined'),
('ACC0004', 'Dust', '2000-01-01', 'Pending'),
('ACC0005', 'Mold', '2000-01-01', 'Approved'),
('ACC0006', 'Cats', '2000-01-01', 'Declined'),
('ACC0007', 'Dogs', '2000-01-01', 'Pending');

INSERT INTO PatientPaymentMethods(PaymentMethodId, PatientId, Merchant, CardName, CardNumber, CardExpiryDate) VALUES
('PMI0001', 'ACC0003', 'Visa', 'John Doe', '1234567890123456', '2027-12-01'),
('PMI0002', 'ACC0003', 'Mastercard', 'Jane Doe', '1234567890123457', '2028-04-01'),
('PMI0003', 'ACC0005', 'American Express', 'John Smith', '1234567890123458', '2030-01-01'),
('PMI0004', 'ACC0005', 'Visa', 'John Smith', '9357206739602768', '2023-01-01'),
('PMI0005', 'ACC0006', 'Discover', 'Jane Smith', '1234567890123459', '2028-08-01'),
('PMI0006', 'ACC0007', 'JCB', 'John Doe', '1234567890123460', '2027-12-01');

INSERT INTO Doctor(DoctorId, DoctorCreatedBy) VALUES
('ACC0008', 'ACC0001'),
('ACC0009', 'ACC0002');

INSERT INTO Company(CompanyId, CompanyCreatedBy, CompanyAddress) VALUES
('ACC0010', 'ACC0001', '1234 Main St'),
('ACC0011', 'ACC0002', '5678 Elm St');

INSERT INTO Questionnaire(AccountId, QOne, QTwo, QThree, QFour, QFive, QSix) VALUES
('ACC0003', 'Yes', '$75,000', 'No', 3, 'Own', 'No'),
('ACC0004', 'No', 'N/A', 'Yes', 1, 'Rent', 'Yes'),
('ACC0005', 'Maybe', '$50,000 - $75,000', 'Depends', 2, 'Rent', 'No'),
('ACC0006', 'Full-time student', 'N/A', 'No', 1, 'Live with parents', 'N/A'),
('ACC0007', 'Part-time', '$25,000 - $50,000', 'No', 0, 'Rent', 'No');

INSERT INTO SlotTime(SlotTimeId, SlotTime) VALUES
('SLOT001', '09:00-09:30'),
('SLOT002', '09:30-10:00'),
('SLOT003', '10:00-10:30'),
('SLOT004', '10:30-11:00'),
('SLOT005', '11:00-11:30'),
('SLOT006', '11:30-12:00'),
('SLOT007', '12:00-12:30'),
('SLOT008', '12:30-13:00'),
('SLOT009', '13:00-13:30'),
('SLOT010', '13:30-14:00'),
('SLOT011', '14:00-14:30'),
('SLOT012', '14:30-15:00'),
('SLOT013', '15:00-15:30'),
('SLOT014', '15:30-16:00'),
('SLOT015', '16:00-16:30'),
('SLOT016', '16:30-17:00'),
('SLOT017', '17:00-17:30'),
('SLOT018', '17:30-18:00'),
('SLOT019', '18:00-18:30'),
('SLOT020', '18:30-19:00'),
('SLOT021', '19:00-19:30'),
('SLOT022', '19:30-20:00');

INSERT INTO AvailableSlot (SlotId, DoctorId, SlotDate, SlotTimeId) VALUES
('SLO0001', 'ACC0008', '2024-05-10', 'SLOT003'),
('SLO0002', 'ACC0009', '2024-05-24', 'SLOT004'),
('SLO0003', 'ACC0008', '2024-06-03', 'SLOT007'),
('SLO0004', 'ACC0008', '2024-06-03', 'SLOT007'),
('SLO0005', 'ACC0009', '2024-07-01', 'SLOT020'),
('SLO0006', 'ACC0008', '2024-08-20', 'SLOT010'),
('SLO0007', 'ACC0009', '2024-10-15', 'SLOT017');

INSERT INTO Appointments (AppointmentId, PatientId, DoctorId, SlotId, ConsultationCost, Reason, DoctorNote) VALUES
('APP0001', 'ACC0005', 'ACC0008', 'SLO0001', 10.00, 'High Fever and Coughing', 'Prescribed Medication to Patient, to monitor.'),
('APP0002', 'ACC0005', 'ACC0009', 'SLO0002', 10.00, 'High Fever and Sneezing', 'Follow-up appointment to be made.'),
('APP0003', 'ACC0006', 'ACC0008', 'SLO0003', 15.00, 'Chest Pain', 'Medication prescribed, follow-up appointment required.'),
('APP0004', 'ACC0005', 'ACC0008', 'SLO0004', 15.00, 'Flu', 'Medication prescribed, patient is fine.'),
('APP0005', 'ACC0007', 'ACC0009', 'SLO0005', NULL, 'MRI Scan', NULL),
('APP0006', 'ACC0005', 'ACC0008', 'SLO0006', NULL, 'Follow-up Appointment', NULL),
('APP0007', 'ACC0005', 'ACC0009', 'SLO0007', NULL, 'Follow-up Appointment', NULL);

INSERT INTO PaymentRequest (PaymentRequestId, AppointmentId, PaymentRequestMessage, PaymentRequestCreatedDate, PaymentRequestStatus) VALUES
('REQ0001', 'APP0001', 'Not enough money to pay for this appointment', '2024-05-20', 'Pending');

INSERT INTO Payments (PaymentId, AppointmentId, PaymentStatus) VALUES
('PAY0001', 'APP0001', 'Unpaid'),
('PAY0002', 'APP0002', 'Paid'),
('PAY0003', 'APP0003', 'Unpaid'),
('PAY0004', 'APP0004', 'Unpaid');

INSERT INTO DrugInventory(DrugName, DrugPrice, DrugDescription) VALUES
('Aspirin', 5.99, 'Pain relief'),
('Paracetamol', 5.99, 'Fever relief'),
('Ibuprofen', 7.99, 'Inflammation relief'),
('Panadol', 8.99, 'Pain relief'),
('Calcium Channel Blockers', 16.99, 'Lower blood pressure'),
('Tamoxifen', 7.99, 'Treatment for breast cancer'),
('Penicillamine', 7.99, 'Treatment for rheumatoid arthritis'),
('Prazosin', 7.99, 'Treatment for hypertension'),
('Magnesium Carbonate', 7.99, 'Reducing excessive acid in the stomach'),
('Promethazine', 7.99, 'Inflammation relief'),
('Aciclovir', 7.99, 'Treatment for viral infections'),
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
('DRI0003', 'Paracetamol', '2025-2-21', 150, 300, '2024-01-11','ACC0010'),
('DRI0004', 'Panadol', '2024-11-30', 150, 300, '2024-01-11','ACC0010'),
('DRI0005', 'Calcium Channel Blockers', '2024-11-30', 150, 300, '2024-01-12','ACC0010'),
('DRI0006', 'Tamoxifen', '2024-10-23', 150, 300, '2024-01-12','ACC0010'),
('DRI0007', 'Penicillamine', '2024-11-30', 150, 300, '2024-01-13','ACC0010'),
('DRI0008', 'Prazosin', '2024-11-30', 150, 300, '2024-01-13','ACC0010'),
('DRI0009', 'Magnesium Carbonate', '2024-11-30', 150, 300, '2024-01-14','ACC0010'),
('DRI0010', 'Promethazine', '2024-11-30', 150, 300, '2024-01-14', 'ACC0011'),
('DRI0011', 'Co-trimoxazole', '2024-11-30', 150, 300, '2024-01-15', 'ACC0011'), 
('DRI0012', 'Metronidazole', '2024-11-30', 150, 300, '2024-01-15', 'ACC0010'), 
('DRI0013', 'Benzydamine', '2024-11-30', 150, 300, '2024-01-16', 'ACC0011'), 
('DRI0014', 'Digoxin', '2024-11-30', 150, 300, '2024-01-16', 'ACC0010'), 
('DRI0015', 'Dipyridamole', '2024-11-30', 150, 300, '2024-01-17', 'ACC0011'), 
('DRI0016', 'Pheniramine', '2024-11-30', 150, 300, '2024-01-18', 'ACC0011'), 
('DRI0017', 'Aciclovir', '2024-11-30', 150, 300, '2024-01-19', 'ACC0011'); 

INSERT INTO PrescribedMedication (PrescribedMedId, AppointmentId, DrugName, Quantity, Reason, DrugRequest) VALUES
('PRM0001', 'APP0001', 'Aspirin', 10, 'Pain relief', 'Completed'),
('PRM0002', 'APP0001', 'Paracetamol', 10, 'Fever', 'Pending'),
('PRM0003', 'APP0002', 'Ibuprofen', 10, 'Fever and Pain Relief', 'Pending'),
('PRM0004', 'APP0002', 'Pheniramine', 10, 'Allergy', 'Pending'),
('PRM0005', 'APP0003', 'Digoxin', 10, 'Heart Failure', 'Pending'),
('PRM0006', 'APP0003', 'Magnesium Carbonate', 10, 'Heartburn', 'Pending'),
('PRM0007', 'APP0004', 'Magnesium Carbonate', 10, 'Heartburn', 'Pending');

INSERT INTO DrugTopupRequest (TopupId, DrugName, TopupQuantity, TopupRequestDate, TopupStatus) VALUES
('DRT0001', 'Paracetamol', 100, '2024-05-01', 'Completed'),
('DRT0002', 'Ibuprofen', 200, '2024-05-05', 'Pending');

USE master;