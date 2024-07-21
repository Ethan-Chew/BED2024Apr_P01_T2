USE CareLinc;

CREATE TABLE Account (
    AccountId VARCHAR(7),
    AccountName VARCHAR(255) NOT NULL,
    AccountPassword VARCHAR(255) NOT NULL,
    AccountEmail VARCHAR(255) NOT NULL,
    AccountCreationDate BIGINT NOT NULL,

	CONSTRAINT PK_Account PRIMARY KEY (AccountId),
);

CREATE TABLE DrugInventory (
	DrugName VARCHAR(255) NOT NULL,
	DrugPrice MONEY NOT NULL,
	DrugDescription VARCHAR(255) NOT NULL

	CONSTRAINT PK_DrugInventory PRIMARY KEY (DrugName),
);

--Accounts-- 
CREATE TABLE Staff (
	StaffId VARCHAR(7) NOT NULL,
	
	CONSTRAINT PK_Staff PRIMARY KEY (StaffId),
	CONSTRAINT FK_Staff FOREIGN KEY (StaffId) REFERENCES Account(AccountId)
);

CREATE TABLE Patient (
	PatientId VARCHAR(7) NOT NULL,
	KnownAllergies VARCHAR(255) NOT NULL,
	PatientBirthdate DATE NOT NULL,
	PatientIsApproved VARCHAR(20) NOT NULL CHECK (PatientIsApproved IN ('Pending', 'Approved', 'Declined')),

	CONSTRAINT PK_Patient PRIMARY KEY (PatientId),
	CONSTRAINT FK_Patient FOREIGN KEY (PatientId) REFERENCES Account(AccountId)
);

CREATE TABLE DigitalWallet (
	PatientId VARCHAR(7) NOT NULL UNIQUE,
	WalletBalance MONEY NOT NULL,

	CONSTRAINT PK_DigitalWallet PRIMARY KEY (PatientId),
)

CREATE TABLE DigitalWalletHistory (
	PatientId VARCHAR(7) NOT NULL,
	WalletTransactionId INT IDENTITY(1,1),
	TransactionTitle VARCHAR(255) NOT NULL,
	TransactionAmount MONEY NOT NULL,
	TransactionDate BIGINT NOT NULL,

	CONSTRAINT PK_DigitalWalletHistory PRIMARY KEY (PatientId, WalletTransactionId),
	CONSTRAINT FK_DigitalWalletHistory_Patient FOREIGN KEY (PatientId) REFERENCES Patient(PatientId),
	CONSTRAINT FK_DigitalWalletHistory_Wallet FOREIGN KEY (PatientId) REFERENCES DigitalWallet(PatientId),
)

CREATE TABLE PatientPaymentMethods (
	PaymentMethodId VARCHAR(7) NOT NULL,
	PatientId VARCHAR(7) NOT NULL,
	Merchant VARCHAR(255) NOT NULL CHECK (Merchant IN ('Visa', 'Mastercard', 'American Express', 'Discover', 'JCB')),
	CardName VARCHAR(255) NOT NULL,
	CardNumber VARCHAR(16) NOT NULL,
	CardExpiryDate DATE NOT NULL,

	CONSTRAINT PK_PatientPaymentMethods PRIMARY KEY (PaymentMethodId),
	CONSTRAINT FK_PatientPaymentMethods_Account FOREIGN KEY (PatientId) REFERENCES Patient(PatientId)
);

CREATE TABLE Doctor (
	DoctorId VARCHAR(7) NOT NULL,
	DoctorCreatedBy VARCHAR(7) NOT NULL,

	CONSTRAINT PK_Doctor PRIMARY KEY (DoctorId),
	CONSTRAINT FK_Doctor_Account FOREIGN KEY (DoctorId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Doctor_Staff FOREIGN KEY (DoctorCreatedBy) REFERENCES Staff(StaffId),
);

CREATE TABLE Company (
	CompanyId VARCHAR(7) NOT NULL,
	CompanyCreatedBy VARCHAR(7) NOT NULL,
	CompanyAddress VARCHAR (255) NOT NULL,

	CONSTRAINT PK_Company PRIMARY KEY (CompanyId),
	CONSTRAINT FK_Company_Account FOREIGN KEY (CompanyId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Company_Staff FOREIGN KEY (CompanyCreatedBy) REFERENCES Staff(StaffId),

);

CREATE TABLE Questionnaire (
    AccountId VARCHAR(7) NOT NULL,
    QOne VARCHAR(255) NOT NULL,
    QTwo VARCHAR(255) NOT NULL,
    QThree VARCHAR(255) NOT NULL,
    QFour VARCHAR(255) NOT NULL,
    QFive VARCHAR(255) NOT NULL,
    QSix VARCHAR(255) NOT NULL,

	CONSTRAINT PK_Questionnaire PRIMARY KEY (AccountId),
	CONSTRAINT FK_Questionnaire_Patient FOREIGN KEY (AccountId) REFERENCES Patient(PatientId)
);

CREATE TABLE ChatbotHistory (
	PatientId VARCHAR(7) NOT NULL,
	MessageBody VARCHAR(8000) NOT NULL,
	MessageRole VARCHAR(10) NOT NULL CHECK (MessageRole IN ('user', 'model')),
	MessageDate BIGINT NOT NULL,

	CONSTRAINT PK_ChatbotHistory PRIMARY KEY (PatientId, MessageDate),
	CONSTRAINT FK_ChatbotHistory_Patient FOREIGN KEY (PatientId) REFERENCES Patient(PatientId)
)

CREATE TABLE SlotTime (
	SlotTimeId VARCHAR(7) NOT NULL,
	SlotTime VARCHAR(20) NOT NULL UNIQUE,

	CONSTRAINT PK_SlotTime PRIMARY KEY (SlotTimeId),
)

CREATE TABLE AvailableSlot (
	SlotId VARCHAR(7),
	DoctorId VARCHAR(7) NOT NULL,
	SlotDate DATE NOT NULL,
	SlotTimeId VARCHAR(7) NOT NULL,

	CONSTRAINT PK_AvailableSlot PRIMARY KEY (SlotId),
	CONSTRAINT FK_AvailableSlot_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_AvailableSlot_SlotTime FOREIGN KEY (SlotTimeId) REFERENCES SlotTime(SlotTimeId),
);

CREATE TABLE Appointments (
	AppointmentId VARCHAR(7) NOT NULL,
	PatientId VARCHAR(7) NOT NULL,
	DoctorId VARCHAR(7) NULL,
	SlotId VARCHAR(7) NOT NULL UNIQUE,
	ConsultationCost MONEY NULL,
	Reason VARCHAR(255) NOT NULL,
	DoctorNote VARCHAR(255) NULL,

	CONSTRAINT PK_Appointment PRIMARY KEY (AppointmentId),
	CONSTRAINT FK_Appointment_Account FOREIGN KEY (PatientId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_Appointment_Slot FOREIGN KEY (SlotId) REFERENCES AvailableSlot(SlotId),
);

CREATE TABLE PaymentRequest (
	PaymentRequestId VARCHAR(7) NOT NULL,
	AppointmentId VARCHAR(7) NOT NULL,
	PaymentRequestMessage VARCHAR(255) NOT NULL,
	PaymentRequestCreatedDate DATE NOT NULL,
	PaymentRequestStatus VARCHAR(10) NOT NULL CHECK (PaymentRequestStatus IN ('Pending', 'Approved', 'Rejected')),
	
	CONSTRAINT PK_PaymentRequest PRIMARY KEY (PaymentRequestId),
	CONSTRAINT FK_PaymentRequest_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId)
)

CREATE TABLE Payments (
	PaymentId VARCHAR(7),
	AppointmentId VARCHAR(7) NOT NULL,
	PaymentStatus VARCHAR (10) NOT NULL CHECK (PaymentStatus IN ('Paid','Unpaid')),
	PaymentType VARCHAR(10) NULL CHECK (PaymentType IN ('DWallet', 'Card')),

	CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),
	CONSTRAINT FK_Payments_Appointments FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
)

CREATE TABLE DrugInventoryRecord (
	DrugRecordId VARCHAR(7) NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	DrugExpiryDate DATE NOT NULL,
	DrugAvailableQuantity INT NOT NULL,
	DrugTotalQuantity INT NOT NULL,
	DrugRecordEntryDate DATE NOT NULL,
	CompanyId VARCHAR(7) NOT NULL,

	CONSTRAINT PK_DrugInventoryRecord PRIMARY KEY (DrugRecordId),
	CONSTRAINT FK_DrugInventoryRecord_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName),
	CONSTRAINT FK_DrugInventoryRecord_Company FOREIGN KEY (CompanyId) REFERENCES Company(CompanyId),
)

CREATE TABLE PrescribedMedication (
	PrescribedMedId VARCHAR(7) NOT NULL,
	AppointmentId VARCHAR(7) NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Reason VARCHAR(255) NOT NULL,
	DrugRequest VARCHAR(10) NULL CHECK (DrugRequest IN ('Cancelled', 'Pending', 'Completed')),

	CONSTRAINT PK_PrescribedMedication PRIMARY KEY (PrescribedMedId),
	CONSTRAINT PK_PrescribedMedication_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
	CONSTRAINT FK_PrescribedMedication_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName),
	CONSTRAINT UQ_PrescribedMedication UNIQUE (AppointmentId, DrugName)
);

CREATE TABLE DrugRequestContribution (
	AppointmentId VARCHAR(7) NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	TotalCost MONEY NOT NULL,
	ContributeDate DATE NOT NULL,
	ConfirmationDate DATE NULL,
	ContributionStatus VARCHAR(10) NOT NULL CHECK (ContributionStatus IN ('Pending', 'Completed')),
	CompanyId VARCHAR(7) NOT NULL,
	DrugRecordId VARCHAR(7) NOT NULL,

	CONSTRAINT PK_DrugRequestContribution PRIMARY KEY (AppointmentId, DrugName),
    CONSTRAINT FK_DrugRequestContribution_PrescribedMedication FOREIGN KEY (AppointmentId, DrugName) REFERENCES PrescribedMedication(AppointmentId, DrugName),
	CONSTRAINT FK_DrugRequestContribution_Company FOREIGN KEY (CompanyId) REFERENCES Company(CompanyId),
	CONSTRAINT FK_DrugRequestContribution_DrugInventoryRecord FOREIGN KEY (DrugRecordId) REFERENCES DrugInventoryRecord(DrugRecordId)
);

CREATE TABLE DrugTopupRequest (
	TopupId VARCHAR(7) NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	TopupQuantity INT NOT NULL,
	TopupRequestDate DATE NOT NULL,
	TopupStatus VARCHAR(10) NOT NULL CHECK (TopupStatus IN ('Pending', 'Cancelled', 'Completed')),

	CONSTRAINT PK_DrugTopupRequest PRIMARY KEY (TopupId),
	CONSTRAINT FK_DrugTopupRequest_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName)
)

CREATE TABLE Notification (
	NotificationId VARCHAR(7) NOT NULL,
	SenderId VARCHAR(7) NOT NULL,
	ReceiverId VARCHAR(7) NOT NULL,
	MessageValue VARCHAR (255) NOT NULL,
	ReadStatus VARCHAR (10) NOT NULL CHECK (ReadStatus IN ('Recieved', 'Read', 'Sent'))

	CONSTRAINT PK_Notification PRIMARY KEY (NotificationId),
	CONSTRAINT FK_Notification_SenderId FOREIGN KEY (SenderId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Notification_ReceiverId FOREIGN KEY (ReceiverId) REFERENCES Account(AccountId)
)

USE master;