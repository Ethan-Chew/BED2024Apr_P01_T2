USE CareLinc;

INSERT INTO Account(AccountId, AccountName, AccountPassword, AccountEmail, AccountCreationDate) VALUES
('ACC0001', 'User1', '$2a$10$rP1fkh4ouGntzi2R./73Cu/3v5lBi.PiM8LdY/3.oZNfPvpUw/oUy', 'user1@mail.com', 1718096320), 
('ACC0002', 'User2', '$2a$10$O.nB4Hki64pvw9j0T05dau4vViKiBDFUVtgKtJBu6PO0bHoKfW8rS', 'user2@mail.com', 1717839920),
('ACC0003', 'User3', '$2a$10$ShLvNLcG1t/Cd5yJErL0l.gbxvQwXx/b4VU3VoqLaYlcZ5JFGhKRi', 'user3@mail.com', 1717773120),
('ACC0004', 'User4', '$2a$10$Qeqj8IazE925Tl4rSQ.FnOWZvZiqyMIqEauiominYrADX0dSvzRFy', 'user4@mail.com', 1718361520),
('ACC0005', 'User5', '$2a$10$2bkrSl8z1zxWOgVect1C5u3nUTXfF1MFVjDkLlRZwBLT0NqVzmJYy', 'user5@mail.com', 1717607320), 
('ACC0006', 'User6', '$2a$10$TIUmtJ2r25mPc8zehoxLLe4axWgRjCnDNnNUBsZt7Q6481j8ugweO', 'user6@mail.com', 1718446720),
('ACC0007', 'User7', '$2a$10$3BnKKhkH41BaDj6Q06fFQewWq6N5j0pbg4LZWDoUl/f7/MXVjQay6', 'user7@mail.com', 1717931520),
('ACC0008', 'User8', '$2a$10$EgGc2W8RtnnaNzr1CrlcPOM/fsV.Ffd3QGEvRjwVMNyZrlF7AVhFG', 'user8@mail.com', 1717607320),
('ACC0009', 'User9', '$2a$10$ZFuJFid/f/aRtfKmMVN8bOb7Hhrt0UxtlD2whCMlYkTzDZbU4fkQ.', 'user9@mail.com', 1718446720),
('ACC0010', 'User10', '$2a$10$e6mDvpOpbBD.ilex2kYiHelknfpb8HbYSsGOcMj7AMzNrswhc75E2', 'user10@mail.com', 1717931520),
('ACC0011', 'User11', '$2a$10$Y8NLtDGLpYUpOhnTpaM9eu/KxDjAtfj0MQPDYl5JIG2WxhyF/Zv.i', 'user11@mail.com', 1717607320),
('ACC0012', 'User12', '$2a$10$JqORjogVhWCrpwCf.3bTO.OewtplB2r08J5v4w/rdTmr3BCghpjMu', 'user12@mail.com', 1718446720);

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
('SLO0003', 'ACC0008', '2024-06-03', 'SLOT002'),
('SLO0004', 'ACC0008', '2024-06-03', 'SLOT007'),
('SLO0005', 'ACC0009', '2024-07-01', 'SLOT020'),
('SLO0006', 'ACC0008', '2024-07-20', 'SLOT010'),
('SLO0007', 'ACC0008', '2024-07-20', 'SLOT005'),
('SLO0008', 'ACC0008', '2024-07-20', 'SLOT007'),
('SLO0009', 'ACC0008', '2024-07-20', 'SLOT008'),
('SLO0010', 'ACC0008', '2024-07-20', 'SLOT002'),
('SLO0011', 'ACC0008', '2024-07-22', 'SLOT004'),
('SLO0012', 'ACC0008', '2024-07-22', 'SLOT007'),
('SLO0013', 'ACC0008', '2024-07-22', 'SLOT003'),
('SLO0014', 'ACC0008', '2024-07-22', 'SLOT002'),
('SLO0015', 'ACC0008', '2024-07-22', 'SLOT001'),
('SLO0016', 'ACC0008', '2024-07-22', 'SLOT016'),
('SLO0017', 'ACC0008', '2024-07-23', 'SLOT019'),
('SLO0018', 'ACC0008', '2024-07-23', 'SLOT018'),
('SLO0019', 'ACC0008', '2024-07-23', 'SLOT020'),
('SLO0020', 'ACC0008', '2024-07-23', 'SLOT013'),
('SLO0021', 'ACC0008', '2024-07-23', 'SLOT015'),
('SLO0022', 'ACC0008', '2024-07-23', 'SLOT014'),
('SLO0023', 'ACC0008', '2024-07-23', 'SLOT012'),
('SLO0024', 'ACC0008', '2024-08-20', 'SLOT010'),
('SLO0025', 'ACC0008', '2024-08-20', 'SLOT002'),
('SLO0026', 'ACC0008', '2024-08-20', 'SLOT007'),
('SLO0027', 'ACC0008', '2024-08-20', 'SLOT003'),
('SLO0028', 'ACC0008', '2024-08-20', 'SLOT009'),
('SLO0029', 'ACC0009', '2024-10-15', 'SLOT017'),
('SLO0030', 'ACC0009', '2024-10-15', 'SLOT020'),
('SLO0031', 'ACC0009', '2024-10-15', 'SLOT012'),
('SLO0032', 'ACC0009', '2024-10-15', 'SLOT010'),
('SLO0033', 'ACC0009', '2024-10-15', 'SLOT006'),
('SLO0034', 'ACC0009', '2024-10-15', 'SLOT008'),
('SLO0035', 'ACC0009', '2024-10-15', 'SLOT013'),
('SLO0036', 'ACC0008', '2024-09-11', 'SLOT001'),
('SLO0037', 'ACC0009', '2024-09-11', 'SLOT002'),
('SLO0038', 'ACC0008', '2024-09-11', 'SLOT003'),
('SLO0039', 'ACC0008', '2024-09-11', 'SLOT004'),
('SLO0040', 'ACC0009', '2024-09-11', 'SLOT005'),
('SLO0041', 'ACC0008', '2024-09-11', 'SLOT006');

INSERT INTO Appointments (AppointmentId, PatientId, DoctorId, SlotId, ConsultationCost, Reason, DoctorNote) VALUES
('APP0001', 'ACC0005', 'ACC0008', 'SLO0001', 10.00, 'High Fever and Coughing', 'Prescribed Medication to Patient, to monitor.'),
('APP0002', 'ACC0005', 'ACC0009', 'SLO0002', 10.00, 'High Fever and Sneezing', 'Follow-up appointment to be made.'),
('APP0003', 'ACC0006', 'ACC0008', 'SLO0003', 15.00, 'Chest Pain', 'Medication prescribed, follow-up appointment required.'),
('APP0004', 'ACC0005', 'ACC0008', 'SLO0004', 15.00, 'Flu', 'Medication prescribed, patient is fine.'),
('APP0005', 'ACC0005', 'ACC0009', 'SLO0012', 20.00, 'Headache and Nausea', 'Recommended rest and hydration.'),
('APP0006', 'ACC0005', 'ACC0009', 'SLO0014', 30.00, 'Stomach Ache', 'Prescribed antacids.'),
('APP0007', 'ACC0005', 'ACC0009', 'SLO0015', 10.00, 'Seasonal Allergies', 'Prescribed antihistamines.'),
('APP0008', 'ACC0005', 'ACC0009', 'SLO0016', 15.00, 'Sore Throat', 'Prescribed throat lozenges.'),
('APP0009', 'ACC0005', 'ACC0009', 'SLO0017', 18.00, 'Sprained Ankle', 'Recommended ice and elevation.'),
('APP0010', 'ACC0005', 'ACC0009', 'SLO0018', 12.00, 'Ear Infection', 'Prescribed antibiotics.'),
('APP0011', 'ACC0005', 'ACC0009', 'SLO0019', 22.00, 'Sinus Infection', 'Recommended nasal spray.'),
('APP0012', 'ACC0005', 'ACC0009', 'SLO0020', 17.00, 'Skin Rash', 'Prescribed topical cream.'),
('APP0013', 'ACC0005', 'ACC0009', 'SLO0021', 10.00, 'High Blood Pressure', 'Adjusted medication dosage.'),
('APP0014', 'ACC0005', 'ACC0009', 'SLO0022', 25.00, 'Asthma Checkup', 'Prescribed inhaler refill.'),
('APP0015', 'ACC0005', 'ACC0009', 'SLO0023', 20.00, 'Diabetes Follow-up', 'Reviewed blood sugar levels.'),
('APP0016', 'ACC0007', 'ACC0009', 'SLO0024', NULL, 'MRI Scan', NULL),
('APP0017', 'ACC0005', 'ACC0008', 'SLO0029', NULL, 'Follow-up Appointment', NULL),
('APP0018', 'ACC0005', 'ACC0009', 'SLO0036', NULL, 'Follow-up Appointment', NULL);

INSERT INTO PaymentRequest (PaymentRequestId, AppointmentId, PaymentRequestMessage, PaymentRequestCreatedDate, PaymentRequestStatus, PaymentPaidAmount) VALUES
('REQ0001', 'APP0001', 'Not enough money to pay for this appointment', '2024-05-20', 'Pending', 0),
('REQ0002', 'APP0002', 'Not enough money to pay for this appointment', '2024-05-24', 'Approved', 0),
('REQ0003', 'APP0004', 'Not enough money to pay for this appointment', '2024-06-03', 'Rejected', 0),
('REQ0004', 'APP0005', 'Not enough money to pay for this appointment', '2024-07-22', 'Pending', 0);

INSERT INTO Payments (PaymentId, AppointmentId, PaymentStatus, PaymentType) VALUES
('PAY0001', 'APP0001', 'Unpaid', NULL),
('PAY0002', 'APP0002', 'Unpaid', NULL),
('PAY0003', 'APP0003', 'Unpaid', NULL),
('PAY0004', 'APP0004', 'Unpaid', NULL),
('PAY0005', 'APP0005', 'Unpaid', NULL),
('PAY0006', 'APP0006', 'Unpaid', NULL),
('PAY0007', 'APP0007', 'Unpaid', NULL),
('PAY0008', 'APP0008', 'Unpaid', NULL),
('PAY0009', 'APP0009', 'Unpaid', NULL),
('PAY0010', 'APP0010', 'Unpaid', NULL),
('PAY0011', 'APP0011', 'Unpaid', NULL),
('PAY0012', 'APP0012', 'Unpaid', NULL),
('PAY0013', 'APP0013', 'Unpaid', NULL),
('PAY0014', 'APP0014', 'Unpaid', NULL),
('PAY0015', 'APP0015', 'Unpaid', NULL);
INSERT INTO DrugInventory(DrugName, DrugPrice, DrugDescription) VALUES
('Aspirin', 0.10, 'Pain relief'),
('Paracetamol', 0.05, 'Fever relief'),
('Ibuprofen', 0.15, 'Inflammation relief'),
('Panadol', 0.20, 'Pain relief'),
('Calcium Channel Blockers', 0.50, 'Lower blood pressure'),
('Tamoxifen', 1.00, 'Treatment for breast cancer'),
('Penicillamine', 0.80, 'Treatment for rheumatoid arthritis'),
('Prazosin', 0.60, 'Treatment for hypertension'),
('Magnesium Carbonate', 0.10, 'Reducing excessive acid in the stomach'),
('Promethazine', 0.25, 'Inflammation relief'),
('Aciclovir', 0.30, 'Treatment for viral infections'),
('Clindamycin', 0.40, 'Treatment for bacterial infections'),
('Co-trimoxazole', 0.35, 'Treatment for bacterial infections'), 
('Metronidazole', 0.20, 'Treatment for gut infections'), 
('Benzydamine', 0.50, 'Pain relief for sore throat'),  
('Digoxin', 0.70, 'Treatment for heart failure'),  
('Dipyridamole', 0.45, 'Prevent blood clots'), 
('Pheniramine', 0.15, 'Pain relief for eyes');

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
('DRI0017', 'Aciclovir', '2024-11-30', 150, 300, '2024-01-19', 'ACC0011'),
('DRI0018', 'Aspirin', '2024-11-30', 200, 200, '2024-07-01', 'ACC0010');

INSERT INTO PrescribedMedication (PrescribedMedId, AppointmentId, DrugName, Quantity, Reason, DrugRequest) VALUES
('PRM0001', 'APP0001', 'Aspirin', 10, 'Pain relief', NULL),
('PRM0002', 'APP0001', 'Paracetamol', 10, 'Fever', NULL),
('PRM0003', 'APP0002', 'Ibuprofen', 10, 'Fever and Pain Relief', 'Pending'),
('PRM0004', 'APP0002', 'Pheniramine', 10, 'Allergy', 'Pending'),
('PRM0005', 'APP0003', 'Digoxin', 10, 'Heart Failure', NULL),
('PRM0006', 'APP0003', 'Magnesium Carbonate', 10, 'Heartburn', NULL),
('PRM0007', 'APP0004', 'Magnesium Carbonate', 10, 'Heartburn', NULL),
('PRM0008', 'APP0004', 'Promethazine', 10, 'Insomnia', NULL),
('PRM0009', 'APP0004', 'Digoxin', 10, 'Heart Failure', 'Pending'),
('PRM0010', 'APP0005', 'Prazosin', 10, 'Hypertension', 'Completed'),
('PRM0011', 'APP0005', 'Calcium Channel Blockers', 10, 'Lower blood pressure', 'Pending'),
('PRM0012', 'APP0005', 'Clindamycin', 10, 'Bacterial infection', 'Pending'),
('PRM0013', 'APP0006', 'Paracetamol', 10, 'Fever relief', NULL),
('PRM0014', 'APP0006', 'Penicillamine', 10, 'Rheumatoid arthritis', NULL),
('PRM0015', 'APP0007', 'Aspirin', 10, 'Pain relief', NULL),
('PRM0016', 'APP0007', 'Benzydamine', 10, 'Sore throat', NULL),
('PRM0017', 'APP0008', 'Panadol', 10, 'Pain relief', NULL),
('PRM0018', 'APP0008', 'Dipyridamole', 10, 'Prevent blood clots', NULL),
('PRM0019', 'APP0009', 'Benzydamine', 10, 'Sore throat', NULL),
('PRM0020', 'APP0009', 'Aspirin', 10, 'Pain relief', NULL),
('PRM0021', 'APP0010', 'Aciclovir', 10, 'Viral infection', NULL),
('PRM0022', 'APP0010', 'Clindamycin', 10, 'Viral infection', NULL),
('PRM0023', 'APP0011', 'Tamoxifen', 10, 'Breast cancer treatment', NULL),
('PRM0024', 'APP0011', 'Dipyridamole', 10, 'Prevent blood clots', NULL),
('PRM0025', 'APP0012', 'Paracetamol', 10, 'Fever relief', NULL),
('PRM0026', 'APP0012', 'Prazosin', 10, 'Hypertension', NULL),
('PRM0027', 'APP0013', 'Ibuprofen', 10, 'Pain relief', NULL),
('PRM0028', 'APP0013', 'Panadol', 10, 'Pain relief', NULL),
('PRM0029', 'APP0014', 'Promethazine', 10, 'Inflammation relief', NULL),
('PRM0030', 'APP0014', 'Benzydamine', 10, 'Sore throat', NULL),
('PRM0031', 'APP0015', 'Aciclovir', 10, 'Viral infection', NULL),
('PRM0032', 'APP0015', 'Penicillamine', 10, 'Rheumatoid arthritis', NULL);

-- Sample data for DrugRequestContribution table
INSERT INTO DrugRequestContribution (AppointmentId, DrugName, InventoryContribution, ContributionQuantity, TotalCost, ContributeDate, ConfirmationDate, ContributionStatus, CompanyId, DrugRecordId) VALUES
('APP0005', 'Prazosin', 5, 5, 79.90, '2024-06-01', NULL, 'Pending', 'ACC0010', 'DRI0008');

INSERT INTO DrugTopupRequest (TopupId, DrugName, TopupQuantity, TopupRequestDate, TopupStatus) VALUES
('DRT0001', 'Paracetamol', 100, '2024-05-01', 'Completed'),
('DRT0002', 'Ibuprofen', 200, '2024-05-05', 'Pending');

INSERT INTO Notification (NotificationId, SenderId, ReceiverId, MessageValue, ReadStatus) VALUES
('NOT0001', 'ACC0008', 'ACC0006', 'appointment cancelled, womp womp', 'Sent');

USE master;