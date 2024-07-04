# Schema
This file outlines the Schema for all Classes used in the CareLinc Database. It is a simplified and more readable version of our [SQL Table](../db_config/createtables.sql).
## Account
- **AccountId**: `VARCHAR(7)`, PRIMARY KEY
- **AccountName**: `VARCHAR(255)`, NOT NULL
- **AccountPassword**: `VARCHAR(255)`, NOT NULL
- **AccountEmail**: `VARCHAR(255)`, NOT NULL
- **AccountCreationDate**: `BIGINT`, NOT NULL

## DrugInventory
- **DrugName**: `VARCHAR(255)`, NOT NULL, PRIMARY KEY
- **DrugPrice**: `MONEY`, NOT NULL
- **DrugDescription**: `VARCHAR(255)`, NOT NULL

## Staff
- **StaffId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY

## Patient
- **PatientId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **KnownAllergies**: `VARCHAR(255)`, NOT NULL
- **PatientBirthdate**: `DATE`, NOT NULL
- **PatientIsApproved**: `VARCHAR(20)`, NOT NULL, CHECK (PatientIsApproved IN ('Pending', 'Approved', 'Declined'))

## PatientPaymentMethods
- **PaymentMethodId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **PatientId**: `VARCHAR(7)`, NOT NULL
- **Merchant**: `VARCHAR(255)`, NOT NULL, CHECK (Merchant IN ('Visa', 'Mastercard', 'American Express', 'Discover', 'JCB'))
- **CardName**: `VARCHAR(255)`, NOT NULL
- **CardNumber**: `VARCHAR(16)`, NOT NULL
- **CardExpiryDate**: `DATE`, NOT NULL

## Doctor
- **DoctorId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **DoctorCreatedBy**: `VARCHAR(7)`, NOT NULL

## Company
- **CompanyId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **CompanyCreatedBy**: `VARCHAR(7)`, NOT NULL
- **CompanyAddress**: `VARCHAR(255)`, NOT NULL

## Questionnaire
- **AccountId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **QOne**: `VARCHAR(255)`, NOT NULL
- **QTwo**: `VARCHAR(255)`, NOT NULL
- **QThree**: `VARCHAR(255)`, NOT NULL
- **QFour**: `VARCHAR(255)`, NOT NULL
- **QFive**: `VARCHAR(255)`, NOT NULL
- **QSix**: `VARCHAR(255)`, NOT NULL

## SlotTime
- **SlotTimeId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **SlotTime**: `VARCHAR(20)`, NOT NULL, UNIQUE

## AvailableSlot
- **SlotId**: `VARCHAR(7)`, PRIMARY KEY
- **DoctorId**: `VARCHAR(7)`, NOT NULL
- **SlotDate**: `DATE`, NOT NULL
- **SlotTimeId**: `VARCHAR(7)`, NOT NULL

## Appointments
- **AppointmentId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **PatientId**: `VARCHAR(7)`, NOT NULL
- **DoctorId**: `VARCHAR(7)`, NULL
- **SlotId**: `VARCHAR(7)`, NOT NULL, UNIQUE
- **ConsultationCost**: `MONEY`, NULL
- **Reason**: `VARCHAR(255)`, NOT NULL
- **DoctorNote**: `VARCHAR(255)`, NULL

## PaymentRequest
- **PaymentRequestId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **AppointmentId**: `VARCHAR(7)`, NOT NULL
- **PaymentRequestMessage**: `VARCHAR(255)`, NOT NULL
- **PaymentRequestCreatedDate**: `DATE`, NOT NULL
- **PaymentRequestStatus**: `VARCHAR(10)`, NOT NULL, CHECK (PaymentRequestStatus IN ('Pending', 'Declined', 'Completed'))

## Payments
- **PaymentId**: `VARCHAR(7)`, PRIMARY KEY
- **AppointmentId**: `VARCHAR(7)`, NOT NULL
- **PaymentAmount**: `MONEY`, NULL
- **PaymentStatus**: `VARCHAR(10)`, NOT NULL, CHECK (PaymentStatus IN ('Paid', 'Unpaid'))

## DrugInventoryRecord
- **DrugRecordId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **DrugName**: `VARCHAR(255)`, NOT NULL
- **DrugExpiryDate**: `DATE`, NOT NULL
- **DrugAvailableQuantity**: `INT`, NOT NULL
- **DrugTotalQuantity**: `INT`, NOT NULL
- **DrugRecordEntryDate**: `DATE`, NOT NULL
- **CompanyId**: `VARCHAR(7)`, NOT NULL

## PrescribedMedication
- **PrescribedMedId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **AppointmentId**: `VARCHAR(7)`, NOT NULL
- **DrugName**: `VARCHAR(255)`, NOT NULL
- **Quantity**: `INT`, NOT NULL
- **Reason**: `VARCHAR(255)`, NOT NULL
- **DrugRequest**: `VARCHAR(10)`, NULL, CHECK (DrugRequest IN ('Cancelled', 'Pending', 'Completed'))

## DrugRequestContribution
- **AppointmentId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **DrugName**: `VARCHAR(255)`, NOT NULL, PRIMARY KEY
- **Quantity**: `INT`, NOT NULL
- **TotalCost**: `MONEY`, NOT NULL
- **ContributeDate**: `DATE`, NOT NULL
- **ConfirmationDate**: `DATE`, NULL
- **ContributionStatus**: `VARCHAR(10)`, NOT NULL CHECK (ContributionStatus IN ('Pending', 'Completed')),
- **CompanyId**: `VARCHAR(7)`, NOT NULL

## DrugTopupRequest
- **TopupId**: `VARCHAR(7)`, NOT NULL, PRIMARY KEY
- **DrugName**: `VARCHAR(255)`, NOT NULL
- **TopupQuantity**: `INT`, NOT NULL
- **TopupRequestDate**: `DATE`, NOT NULL
- **TopupStatus**: `VARCHAR(10)`, NOT NULL, CHECK (TopupStatus IN ('Pending', 'Cancelled', 'Completed'))