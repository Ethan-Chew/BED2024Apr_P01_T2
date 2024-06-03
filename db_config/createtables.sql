CREATE TABLE Account (
    AccountId INT,
    AccountName VARCHAR(255) NOT NULL,
    AccountPassword VARCHAR(255) NOT NULL,
    AccountEmail VARCHAR(255) NOT NULL,
    AccountCreationDate DATE NOT NULL,

	CONSTRAINT PK_Account PRIMARY KEY (AccountId),
);

--Accounts-- 
CREATE TABLE Patient (
	AccountId INT NOT NULL,
	KnownAllergies VARCHAR(255) NOT NULL,
	PatientBirthdate DATE NOT NULL,
	PatientIsApproved VARCHAR(20) NOT NULL CHECK (PatientIsApproved IN ("Pending", "Approved", "Declined")),

	CONSTRAINT PK_Patient PRIMARY KEY (AccountId),
	CONSTRAINT FK_Patient FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);

CREATE TABLE Doctor (
	AccountId INT NOT NULL,
	DoctorCreatedBy INT NOT NULL,

	CONSTRAINT PK_Doctor PRIMARY KEY (AccountId),
	CONSTRAINT FK_Doctor_Account FOREIGN KEY (AccountId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Doctor_Staff FOREIGN KEY (DoctorCreatedBy) REFERENCES Staff(AccountId),
);

CREATE TABLE Company (
	AccountId INT NOT NULL,
	CompanyCreatedBy INT NOT NULL,
	CompanyAddress VARCHAR (255) NOT NULL,

	CONSTRAINT PK_Company PRIMARY KEY (AccountId),
	CONSTRAINT FK_Company_Account FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
	CONSTRAINT FK_Company_Staff FOREIGN KEY (CompanyCreatedBy) REFERENCES Staff(AccountId),

);

CREATE TABLE Staff (
	AccountId INT NOT NULL,
	
	CONSTRAINT PK_Staff PRIMARY KEY (AccountId),
	CONSTRAINT FK_Staff FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);


CREATE TABLE Questionnaire (
    QuestionnaireId INT PRIMARY KEY,
    AccountId INT NOT NULL,
    QOne VARCHAR(255) NOT NULL,
    QTwo VARCHAR(255) NOT NULL,
    QThree VARCHAR(255) NOT NULL,
    QFour VARCHAR(255) NOT NULL,
    QFive VARCHAR(255) NOT NULL,
    QSix VARCHAR(255) NOT NULL,

	CONSTRAINT PK_Questionnaire PRIMARY KEY (QuestionnaireId),
	CONSTRAINT FK_Questionnaire_Patient FOREIGN KEY (AccountId) REFERENCES Patient(AccountId)
);

CREATE TABLE AvailableSlot (
	SlotId INT,
	DoctorId INT NOT NULL,
	PatientId INT NULL,
	SlotTime DATETIME NOT NULL,

	CONSTRAINT PK_AvailableSlot PRIMARY KEY (SlotId),
	CONSTRAINT FK_AvailableSlot_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_AvailableSlot_Patient FOREIGN KEY (PatientId) REFERENCES Patient(AccountId),
);

CREATE TABLE Appointments (
	AppointmentId INT NOT NULL,
	AccountId INT NOT NULL,
	DoctorId INT NULL,
	SlotId INT NOT NULL,
	RequestId INT NULL,
	ConsultationCost DOUBLE NOT NULL,
	Reason VARCHAR(255) NOT NULL,
	DoctorNote VARCHAR(255) NULL,

	CONSTRAINT PK_Appointment PRIMARY KEY (AppointmentId),
	CONSTRAINT FK_Appointment_Account FOREIGN KEY (AccountId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_Appointment_Slot FOREIGN KEY (SlotId) REFERENCES AvailableSlot(SlotId),
	CONSTRAINT FK_Appointment_Request FOREIGN KEY (RequestId) REFERENCES DrugDonationRequests(RequestId)
);

CREATE TABLE Payments (
	PaymentId INT,
	AppointmentId INT NOT NULL,
	PaymentAmount DOUBLE NOT NULL,
	IsPaid BOOLEAN NOT NULL,

	CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),
	CONSTRAINT FK_Payments_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
)

CREATE TABLE DrugInventory (
	DrugName VARCHAR(255) NOT NULL,
	ClosestExpiryDate DATE NOT NULL,
	FurthestExpiryDate DATE NULL,
	AvailableQuantity INT NOT NULL,
	Price DOUBLE NOT NULL,
	DrugDescription VARCHAR(255) NOT NULL

	CONSTRAINT PK_DrugInventory PRIMARY KEY (PaymentRequestId),
);

CREATE TABLE PrescribedMedication (
	PrescribedMedId INT NOT NULL,
	AppointmentId INT NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Price DOUBLE NOT NULL,
	Reason VARCHAR(255) NOT NULL,
	DrugRequest VARCHAR(10) NOT NULL CHECK (DrugRequest IN ('Cancelled', 'Pending', 'Fulfilled')),

	CONSTRAINT PK_PrescribedMedication PRIMARY KEY (PrescribedMedId),
	CONSTRAINT PK_PrescribedMedication_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
	CONSTRAINT FK_PrescribedMedication_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName),
);

CREATE TABLE PaymentRequest (
	PaymentRequestId INT NOT NULL,
	AppointmentId INT NOT NULL,
	PaymentRequestMessage VARCHAR(255) NOT NULL,
	PaymentRequestCreatedDate DATE NOT NULL,
	PaymentRequestStatus VARCHAR(10) NOT NULL CHECK (RequestStatus IN ('Waiting', 'Declined', 'Completed')),
	
	CONSTRAINT PK_PaymentRequest PRIMARY KEY (PaymentRequestId),
	CONSTRAINT FK_PaymentRequest_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId)
)

CREATE TABLE DrugTopupRequest (
	TopupId INT NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	TopupQuantity INT NOT NULL,
	TopupRequestDate DATE NOT NULL,
	TopupStatus VARCHAR(10) NOT NULL CHECK (TopupStatus IN ('Waiting', 'Cancelled', 'Completed')),

	CONSTRAINT PK_DrugTopupRequest PRIMARY KEY (TopupId),
	CONSTRAINT FK_DrugTopupRequest_DrugInventory FOREIGN KEY (DrugName) REFERENCES DrugInventory(DrugName)
)