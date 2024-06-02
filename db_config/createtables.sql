CREATE TABLE Account (
    AccountId INT,
    Accountname VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT PK_Account PRIMARY KEY (AccountId),
);

--Accounts-- 
CREATE TABLE Patient (
	AccountId INT NOT NULL,
	KnownAllergies VARCHAR(255) NOT NULL,
	Birthdate DATE NOT NULL,
	IsApproved VARCHAR(20) NOT NULL,

	CONSTRAINT PK_Patient PRIMARY KEY (AccountId),
	CONSTRAINT FK_Patient FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);

CREATE TABLE Doctor (
	AccountId INT NOT NULL,

	CONSTRAINT PK_Doctor PRIMARY KEY (AccountId),
	CONSTRAINT FK_Doctor FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);

CREATE TABLE Company (
	AccountId INT NOT NULL,
	address VARCHAR (255) NOT NULL,

	CONSTRAINT PK_Company PRIMARY KEY (AccountId),
	CONSTRAINT FK_Company FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);

CREATE TABLE Staff (
	AccountId INT NOT NULL,
	
	CONSTRAINT PK_Staff PRIMARY KEY (AccountId),
	CONSTRAINT FK_Staff FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);


CREATE TABLE Questionnaire (
    QuestionnaireId INT PRIMARY KEY AUTO_INCREMENT,
    AccountId INT NOT NULL,
    QOne VARCHAR(255) NOT NULL,
    QTwo VARCHAR(255) NOT NULL,
    QThree VARCHAR(255) NOT NULL,
    QFour VARCHAR(255) NOT NULL,
    QFive VARCHAR(255) NOT NULL,
    QSix VARCHAR(255) NOT NULL,

	CONSTRAINT PK_Questionnaire PRIMARY KEY (QuestionnaireId),
	CONSTRAINT FK_Questionnaire_Account FOREIGN KEY (AccountId) REFERENCES Account(AccountId)
);

CREATE TABLE Appointments (
	AppointmentId INT PRIMARY KEY AUTO_INCREMENT,
	AccountId INT NOT NULL,
	DoctorId INT NULL,
	SlotId INT NOT NULL,
	RequestId INT NULL,
	ConsultationCost DOUBLE NOT NULL,
	Reason VARCHAR(255) NOT NULL,

	CONSTRAINT PK_Appointment PRIMARY KEY (AppointmentId),
	CONSTRAINT FK_Appointment_Account FOREIGN KEY (AccountId) REFERENCES Account(AccountId),
	CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_Appointment_Slot FOREIGN KEY (SlotId) REFERENCES AvailableSlot(SlotId),
	CONSTRAINT FK_Appointment_Request FOREIGN KEY (RequestId) REFERENCES DrugDonationRequests(RequestId)
);

CREATE TABLE PrescribedMedication {
	PrescribedMedId INT PRIMARY KEY AUTO_INCREMENT,
	DrugName VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Price DOUBLE NOT NULL,
	Reason VARCHAR(255) NOT NULL

	CONSTRAINT PK_PrescribedMedication PRIMARY KEY (PrescribedMedId)
};

CREATE TABLE AppointmentMedication {
	AppointmentId INT NOT NULL,
	PrescribedMedId INT NOT NULL,

	CONSTRAINT PK_AppointmentMedication PRIMARY KEY (AppointmentId, PrescribedMedId),
	CONSTRAINT FK_AppointmentMedication_Appointment FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
	CONSTRAINT FK_AppointmentMedication_PrescribedMedication FOREIGN KEY (PrescribedMedId) REFERENCES PrescribedMedication(PrescribedMedId),
}

CREATE TABLE AvailableSlot {
	SlotId INT PRIMARY KEY AUTO_INCREMENT,
	DoctorId INT NOT NULL,
	PatientId INT NULL,
	SlotTime DATETIME NOT NULL,

	CONSTRAINT PK_AvailableSlot PRIMARY KEY (SlotId),
	CONSTRAINT FK_AvailableSlot_Doctor FOREIGN KEY (DoctorId) REFERENCES Doctor(DoctorId),
	CONSTRAINT FK_Appointment_Patient FOREIGN KEY (PatientId) REFERENCES Patient(AccountId),
};

CREATE TABLE DrugInventory (
	DrugName VARCHAR(255) PRIMARY KEY NOT NULL,
	ClosestExpiryDate DATE NOT NULL,
	FurthestExpiryDate DATE NULL,
	AvailableQuantity INT NOT NULL,
	Price DOUBLE NOT NULL,
	DrugDescription VARCHAR(255) NOT NULL

);

CREATE TABLE DrugDonationRequests (
	RequestId INT PRIMARY KEY AUTO_INCREMENT
	OrderId INT NOT NULL,
	StaffId INT NOT NULL,
	DrugName VARCHAR(255) NOT NULL,
	DateRequest DATE NOT NULL,
	Quatity INT NOT NULL,
	Price DOUBLE NOT NULL,
);

CREATE TABLE DrugInventoryEntryRecord (
	EntryId INT PRIMARY KEY NOT NULL,
	DateOfEntry DATE NOT NULL,
	Medicine VARCHAR(255) NOT NULL,
	ExpiryDate DATE NOT NULL,
	STATUS VARCHAR(20) NOT NULL,

);