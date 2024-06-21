# CareLinc
CareLinc is a Healthcare Application, allowing patients from less-privileged families to have access to quality medical care at a low cost. Our users are required to fill out a questionnaire to ensure that they meet the ‘lower socioeconomic status’ criteria before using our app, which is subject to manual approval by the 'administrative' staff.

## Application Features
1. **Chew Ming Hong, Ethan** -- Login/Create Account, Patient Implementation
2. **Hervin Darmawan Sie** -- Admin Implementation
3. **Rafol Emmanuel Legaspi** -- Doctor Implementation, Anonymous Pay-it-Forward
4. **Low Yoke Lun, Jefferson** -- Medical Company Functions

### Feature Descriptions
After signing in, **patients** can book, view, and update appointments, make payments for them, and view their medication histories. Under their medication history, they can see a list of their previous appointments. The medication prescribed and the payment breakdown are shown for every appointment.

In addition, if patients are still unable to afford the subsidised costs of medication, they can ask members of the public for help making payments. However, this can only be done once a month. On our home page, anonymous ‘donors’ can pay for a random patient’s bill.

**Doctors** can publish a schedule showing when they are available for such low-cost consultations and edit the schedule as needed. Then, they can view their upcoming appointments and cancel or reschedule them as needed. They can also view patients’ medical records and update, delete them or create a new record. In addition, doctors can view a list of medications from the web. 

**Medical Companies** will collaborate with the platform to support patients in need. The platform will identify patients requiring medication and post requests to the companies for the specific drugs, dosage and quantity needed. The companies can decide to contribute excess stock of medications in their inventory or donate medication nearing expiry within a safe timeframe, e.g. 9 months, to assist patients while preventing waste. Additionally, companies will have access to a detailed record of all their inventory entries, enabling better inventory management and transparency.

The **Admin Staff** needs to manually approve new patients by ensuring they meet the ‘low socioeconomic status’ criteria. They can then update the stock quantity, expiry date and costs of different medications and add or remove doctors and pharmacists to the system. Admin Staff can also review the Help requested by Patients for their medication payment. After approving it, the staff can either get help from the Medical Companies (for medicine) or from the public (monetary donations).

## API Documentation
All API Endpoints implemented in the Back-End Application is documented in [API Documentation](./docs/APIDocumentation.md). Related Schemas are documented in [Schema Documentation](./docs/Schema.md).

## Credits
Credits can be accessed in the ```public/credits.html``` page.