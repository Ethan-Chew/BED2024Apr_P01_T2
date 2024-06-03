CREATE TABLE Account (
    AccountId INT,
    AccountName VARCHAR(255) NOT NULL,
    AccountPassword VARCHAR(255) NOT NULL,
    AccountEmail VARCHAR(255) NOT NULL,
    AccountCreationDate DATE NOT NULL,

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
	StaffId INT NOT NULL,
	
	CONSTRAINT PK_Staff PRIMARY KEY (StaffId),
	CONSTRAINT FK_Staff FOREIGN KEY (StaffId) REFERENCES Account(AccountId)
);

CREATE TABLE Patient (
	PatientId INT NOT NULL,
	KnownAllergies VARCHAR(255) NOT NULL,
	PatientBirthdate DATE NOT NULL,
	PatientIsApproved VARCHAR(20) NOT NULL CHECK (PatientIsApproved IN ('Pending', 'Approved', 'Declined')),

	CONSTRAINT PK_Patient PRIMARY KEY (PatientId),
	CONSTRAINT FK_Patient FOREIGN KEY (PatientId) REFERENCES Account(AccountId)
);

CREATE TABLE Doctor (
	DoctorId INT NOT NULL,
	DoctorCreatedBy INT NOT NULL,

	CONSTRAINT PK_Doctor PRIMARY KEY (DoctorId),
	CONSTRAINT FK_Doctor_Account FOREIGN KEY (DoctorId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Doctor_Staff FOREIGN KEY (DoctorCreatedBy) REFERENCES Staff(StaffId),
);

CREATE TABLE Company (
	CompanyId INT NOT NULL,
	CompanyCreatedBy INT NOT NULL,
	CompanyAddress VARCHAR (255) NOT NULL,

	CONSTRAINT PK_Company PRIMARY KEY (CompanyId),
	CONSTRAINT FK_Company_Account FOREIGN KEY (CompanyId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Company_Staff FOREIGN KEY (CompanyCreatedBy) REFERENCES Staff(StaffId),

);

CREATE TABLE Questionnaire (
    QuestionnaireId INT NOT NULL,
    AccountId INT NOT NULL,
    QOne VARCHAR(255) NOT NULL,
    QTwo VARCHAR(255) NOT NULL,
    QThree VARCHAR(255) NOT NULL,
    QFour VARCHAR(255) NOT NULL,
    QFive VARCHAR(255) NOT NULL,
    QSix VARCHAR(255) NOT NULL,

	CONSTRAINT PK_Questionnaire PRIMARY KEY (QuestionnaireId),
	CONSTRAINT FK_Questionnaire_Patient FOREIGN KEY (AccountId) REFERENCES Patient(PatientId)
);

CREATE TABLE AvailableSlot (
	SlotId INT,
	DoctorId INT NOT NULL,
	PatientId INT NULL,
	SlotTime DATETIME NOT NULL,

	CONSTRAINT PK_AvailableSlot PRIMARY KEY (SlotId),
	CONSTRAINT FK_AvailableSlot_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_AvailableSlot_Patient FOREIGN KEY (PatientId) REFERENCES Patient(PatientId),
);

CREATE TABLE Appointments (
	AppointmentId INT NOT NULL,
	AccountId INT NOT NULL,
	DoctorId INT NULL,
	SlotId INT NOT NULL,
	RequestId INT NULL,
	ConsultationCost MONEY NOT NULL,
	Reason VARCHAR(255) NOT NULL,
	DoctorNote VARCHAR(255) NULL,

	CONSTRAINT PK_Appointment PRIMARY KEY (AppointmentId),
	CONSTRAINT FK_Appointment_Account FOREIGN KEY (AccountId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_Appointment_Slot FOREIGN KEY (SlotId) REFERENCES AvailableSlot(SlotId)
);

CREATE TABLE PaymentRequest (
	PaymentRequestId INT NOT NULL,
	AppointmentId INT NOT NULL,
	PaymentRequestMessage VARCHAR(255) NOT NULL,
	PaymentRequestCreatedDate DATE NOT NULL,
	PaymentRequestStatus VARCHAR(10) NOT NULL CHECK (PaymentRequestStatus IN ('Waiting', 'Declined', 'Completed')),
	
	CONSTRAINT PK_PaymentRequest PRIMARY KEY (PaymentRequestId),
	CONSTRAINT FK_PaymentRequest_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId)
)

CREATE TABLE Payments (
	PaymentId INT,
	AppointmentId INT NOT NULL,
	PaymentAmount MONEY NULL,
	PaymentStatus VARCHAR (10) NOT NULL CHECK (PaymentStatus IN ('Paid','Unpaid')),

	CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),
	CONSTRAINT FK_Payments_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
)

CREATE TABLE DrugInventoryRecord (
	DrugRecordId INT NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	DrugExpiryDate DATE NOT NULL,
	DrugAvailableQuantity INT NOT NULL,
	DrugTotalQuantity INT NOT NULL,
	DrugRecordEntryDate DATE NOT NULL,

	CONSTRAINT PK_DrugInventoryRecord PRIMARY KEY (DrugRecordId),
	CONSTRAINT FK_DrugInventoryRecord_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName)
)

CREATE TABLE PrescribedMedication (
	PrescribedMedId INT NOT NULL,
	AppointmentId INT NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Price MONEY NOT NULL,
	Reason VARCHAR(255) NOT NULL,
	DrugRequest VARCHAR(10) NULL CHECK (DrugRequest IN ('Cancelled', 'Pending', 'Fulfilled')),

	CONSTRAINT PK_PrescribedMedication PRIMARY KEY (PrescribedMedId),
	CONSTRAINT PK_PrescribedMedication_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
	CONSTRAINT FK_PrescribedMedication_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName),
);

CREATE TABLE DrugTopupRequest (
	TopupId INT NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	TopupQuantity INT NOT NULL,
	TopupRequestDate DATE NOT NULL,
	TopupStatus VARCHAR(10) NOT NULL CHECK (TopupStatus IN ('Waiting', 'Cancelled', 'Completed')),

	CONSTRAINT PK_DrugTopupRequest PRIMARY KEY (TopupId),
	CONSTRAINT FK_DrugTopupRequest_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName)
)