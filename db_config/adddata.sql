INSERT INTO Account(AccountId, AccountName, AccountPassword, AccountEmail, AccountCreationDate) VALUES
("ACC0001", "User1", "password1", "user1@mail.com", 1718096320), 
("ACC0002", "User2", "password2", "user2@mail.com", 1717839920),
("ACC0003", "User3", "password3", "user3@mail.com", 1717773120),
("ACC0004", "User4", "password4", "user4@mail.com", 1718361520),
("ACC0005", "User5", "password5", "user5@mail.com", 1717607320), 
("ACC0006", "User6", "password6", "user6@mail.com", 1718446720),
("ACC0007", "User7", "password7", "user7@mail.com", 1717931520),
("ACC0008", "User8", "password8", "user8@mail.com", 1717607320),
("ACC0009", "User9", "password9", "user9@mail.com", 1718446720),
("ACC0010", "User10", "password10", "user10@mail.com", 1717931520),
("ACC0011", "User11", "password11", "user11@mail.com", 1717607320),
("ACC0012", "User12", "password12", "user12@mail.com", 1718446720),

INSERT INTO Staff(StaffId) VALUES
(1),
(2),

INSERT INTO Patient(PatientId, KnownAllergies, PatientBirthdate, PatientIsApproved) VALUES
(3, "Pollen", 970365600, "Declined"),
(4, "Dust", 970365600, "Pending"),
(5, "Mold", 970365600, "Approved"),
(6, "Cats", 970365600, "Declined"),
(7, "Dogs", 970365600, "Pending"),

INSERT INTO Doctor(DoctorId, DoctorCreatedBy) VALUES
(8, 1),
(9, 2),

INSERT INTO Company(CompanyId, CompanyCreatedBy, CompanyAddress) VALUES
(10, 1, "1234 Main St"),
(11, 2, "5678 Elm St"),

INSERT INTO Questionnaire(QuestionnaireId, AccountId, QOne, QTwo, QThree, QFour, QFive, QSix) VALUES
('QES0001', 3, 'Yes', '$75,000', 'No', 3, 'Own', 'No'),
('QES0002', 4, 'No', 'N/A', 'Yes', 1, 'Rent', 'Yes'),
('QES0003', 5, 'Maybe', '$50,000 - $75,000', 'Depends', 2, 'Rent', 'No'),
('QES0004', 6, 'Full-time student', 'N/A', 'No', 1, 'Live with parents', 'N/A'),
('QES0005', 7, 'Part-time', '$25,000 - $50,000', 'No', 0, 'Rent', 'No');

