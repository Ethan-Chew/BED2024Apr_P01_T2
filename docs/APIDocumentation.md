# CareLinc API Documentation
This document outlines the different endpoints contained in the CareLinc Back-End API.  
All related Schemas are located in the [Schema.md](./Schema.md) file.

## Account Management
### Login to an Account
<details>
<summary><code>POST</code> <code><b>/api/auth/login</b></code></summary>

**Request Body**
 | name | type | data type |
|-----------|-----------|-------------------------|
| email | required | string |
| password | required | string |

**Sample Request Body**
```json
{
    "email": "johndoe@mail.com",
    "password": "password123",
}
```

**Responses**

| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Login Successful", account: <account object}` |
| `403` | `{ status: "Error", message: "Incorrect Password" }` |
| `404` | `{ status: "Error", message: "Account with email <email address> not found." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |
</details>

### Create a New Patient Account
<details>
<summary><code>POST</code> <code><b>/api/auth/create/patient</b></code></summary>

**Request Body**
| name | type | data type |
|-----------|-----------|-------------------------|
| name | required | string |
| email | required | string |
| password | required | string |
| knownAllergies | required | string |
| birthdate | required | string (format: YYYY-MM-DD) |
| email | required | string |
| qns | required | object |

**Data Object for `qns` Attribute**

```json
{
  "qOne": "string",
  "qTwo": "string",
  "qThree": "string",
  "qFour": "string",
  "qFive": "string",
  "qSix": "string"
}
```

**Sample Response Body**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "knownAllergies": "None",
  "birthdate": "1990-01-01",
  "qns": {
    "qOne": "Answer to question one",
    "qTwo": "Answer to question two",
    "qThree": "Answer to question three",
    "qFour": "Answer to question four",
    "qFive": "Answer to question five",
    "qSix": "Answer to question six"
  }
}
```

**Responses**

| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `201` | `{ status: "Success", message: "Account Created Successfully", account: <account object}` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |
</details>

### Retrieve Patient Account
<details>
<summary><code>GET</code> <code><b>/api/patient/{patientId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**
No Request Body is required for the GET request

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Patient with ID Found", patient: <Patient Object>}` |
| `400` | `{ status: "Error", message: "Patient ID is required" }` |
| `403` | `{ status: "Forbidden", message: "You are not authorised to view this account's details" }` |
| `404` | `{ status: "Not Found", message: "Patiet with ID <Patient ID> not found." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

**Patient Response Body**
| name | data type |
|-----------|-------------------------|
| patientId | string |
| name | string |
| email | string |
| birthdate | string (format: YYYY-MM-DD) |
| knownAllergies | string |
| isApproved | string (values: Pending, Approved, Declined) |

**Sample Response Body**
```json
{
  "status": "Success",
  "message": "Patient with ID Found",
  "patient": {
    "name": "User5",
    "email": "user5@mail.com",
    "birthdate": "2000-01-01",
    "patientId": "ACC0005",
    "knownAllergies": "Mold, Grass, Water",
    "isApproved": "Approved"
  }
}
```

</details>

### Update Patient Account
<details>
<summary><code>PUT</code> <code><b>/api/patient/{patientId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**
| name | type | data type |
|-----------|-----------|-------------------------|
| name | required | string |
| email | required | string (format: YYYY-MM-DD) |
| knownAllergies | required | string |
| birthdate | required | string |
| password | required | string, null |

**Sample Request Body**
```json
{
    "name": "John Doe",
    "email": "john_doe@mail.com",
    "birthdate": "2000-01-01",
    "knownAllergies": "Grass",
    "password": null
}
```

**Responses**

| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Patient Account Updated Successfully", account: <account object> }` |
| `400` | `{ status: "Error", message: "Patient ID is required" }` |
| `403` | `{ status: "Forbidden", message: "User is not authorised to update this account's details" }` |
| `500` | `{ status: "Error", message: "Failed to Update Patient Account" }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |
</details>

### Delete Patient Account

<details>
<summary><code>DELETE</code> <code><b>/api/patient/{patientId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**  
No Request Body is required for the DELETE request

**Responses**

| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Patient Account Deleted Successfully" }` |
| `400` | `{ status: "Error", message: "Patient ID is required" }` |
| `403` | `{ status: "Forbidden", message: "User is not authorised to delete this account" }` |
| `500` | `{ status: "Error", message: "Failed to Delete Patient Account" }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |
</details>

## Patient Payment Methods
### Get all Payment Methods with Patient ID

<details>
<summary><code>GET</code> <code><b>/api/patient/{patientId}/paymentMethods</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**  
No Request Body is required for the DELETE request

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Found Payment Methods", paymentMethods: <paymentMethod Object> }` |
| `400` | `{ status: "Error", message: "Patient ID is required" }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to view the Payment Methods for this Patient." }` |
| `404` | `{ status: "Error", message: "Payment Methods not found." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

**Sample Response Body**
```json
{
  "status": "Success",
  "message": "Found Payment Methods",
  "paymentMethods": [
    {
        "id": "PMI0003",
        "patientId": "ACC0005",
        "merchant": "American Express",
        "cardName": "John Smith",
        "cardNumber": "1234567890123458",
        "cardExpiryDate": "2030-01-01T00:00:00.000Z"
    },
    {
        "id": "PMI0004",
        "patientId": "ACC0005",
        "merchant": "Visa",
        "cardName": "John Smith",
        "cardNumber": "9357206739602768",
        "cardExpiryDate": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

</details>

### Create Payment Method

<details>
<summary><code>POST</code> <code><b>/api/patient/{patientId}/paymentMethods</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**  
| name | type | data type |
|-----------|-----------|-------------------------|
| merchant | required | string |
| cardName | required | string |
| cardNumber | required | string (required: 16 characters) |
| cardExpiryDate | required | string (format: YYYY-MM) |

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `201` | `{ status: "Success", message: "Payment Method Created", paymentMethods: <paymentMethod Object> }` |
| `400` | `{ status: "Error", message: "Patient ID is required" }` |
| `400` | `{ status: "Error", message: "Validation Error", errors: <Joi Error> }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to create a Payment Method for this Patient." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

### Delete Payment Method

<details>
<summary><code>DELETE</code> <code><b>/api/patient/{patientId}/paymentMethods/{methodId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |
| methodId | required | Unique Identifier given to every Payment Method |

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `204` | `{ status: "Success", message: "Payment Method Deleted" }` |
| `400` | `{ status: "Error", message: "Patient ID and Payment Method Id are required." }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to delete a Payment Method for this Patient." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

### Update Payment Method

<details>
<summary><code>PUT</code> <code><b>/api/patient/{patientId}/paymentMethods/{methodId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |
| methodId | required | Unique Identifier given to every Payment Method |

**Request Body**  
| name | type | data type |
|-----------|-----------|-------------------------|
| merchant | required | string |
| cardName | required | string |
| cardNumber | required | string (required: 16 characters) |
| cardExpiryDate | required | string (format: YYYY-MM) |

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Payment Method Updated", paymentMethod: <PaymentMethod Object> }` |
| `400` | `{ status: "Error", message: "Method Id, Patient ID, Merchant, Card Name, Card Number, and Card Expiry Date are required." }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to update a Payment Method for this Patient." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

## Send Email

<details>
<summary><code>POST</code> <code><b>/api/mail/paymentConfirmation</b></code></summary>

**Parameters**
No URL Parameters required.

**Request Body**  
| name | type | data type |
|-----------|-----------|-------------------------|
| recepient | required | string |
| paymentAmount | required | string |
| cardMerchant | required | string |
| cardLFDigits | required | string (4 characters) |
| appointmentDate | required | string (format: YYYY-MM-DD) |
| appointmentTime | required | string |

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `201` | `{ message: "Payment Confirmation Email Sent" }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

## Helper Chatbot

### Send Request to the Backend Gemini API
<details>
<summary><code>POST</code> <code><b>/api/chatbot/sendMessage</b></code></summary>

**Parameters**
No URL Parameters required.

**Request Body**  
| name | type | data type |
|-----------|-----------|-------------------------|
| message | required | string |
| history | required | object array |

**Sample Request Body**
```json
{
  "message": "This is a sample request message",
  "history": [
    {
        "role": "user",
        "parts": [{ "text": "Sample User Text" }]
    },
    {
        "role": "model",
        "parts": [{ "text": "Sample Model Text" }]
    },
  ]
}
```

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Successfully sent message to chatbot", response: "Model Response Message" }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

### Get Chatbot History
<details>
<summary><code>GET</code> <code><b>/api/chatbot/history/{patientId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**  
No Request Body is required for the GET request

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Successfully retrieved chatbot history for patient", history: <Array of Objects>, historyTimestamps: <Array<Int>> }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to view the chatbot history for this patient." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

### Save Chatbot History
<details>
<summary><code>POST</code> <code><b>/api/chatbot/history/{patientId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**  
| name | type | data type |
|-----------|-----------|-------------------------|
| history | required | object array |
| historyTimestamps | required | int array |

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ status: "Success", message: "Successfully retrieved chatbot history for patient", history: <Array of Objects>, historyTimestamps: <Array<Int>> }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to view the chatbot history for this patient." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

### Delete Chatbot History
<details>
<summary><code>DELETE</code> <code><b>/api/chatbot/history/{patientId}</b></code></summary>

**Parameters**
| name | type | description |
|-----------|-----------|-------------------------|
| patientId | required | Unique Identifier given to the Patient being retrieved |

**Request Body**  
No Request Body is required for the DELETE request

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `204` | `{ status: "Success" }` |
| `403` | `{ status: "Forbidden", message: "You are not allowed to save chatbot history for this patient." }` |
| `500` | `{ status: "Error", message: "Internal Server Error", error: <Error Object> }` |

</details>

## Appointments

### Get All Patient Appointments
<details>
<summary><code>GET</code> <code><b>/api/appointments/patient/{patientId}</b></code></summary>

</details>

### Get Specific Appointment Detail
<details>
<summary><code>GET</code> <code><b>/api/appointments/{appointmentId}</b></code></summary>

</details>

### Delete Appointment 
<details>
<summary><code>POST</code> <code><b>/api/appointments/{appointmentId}</b></code></summary>

</details>

### Create Appointment
<details>
<summary><code>DELETE</code> <code><b>/api/appointments/{appointmentId}</b></code></summary>

</details>

### Update Appointment
<details>
<summary><code>DELETE</code> <code><b>/api/appointments/{appointmentId}</b></code></summary>

</details>

## Company

<details>
<summary><code>GET</code> <code><b>/api/drugRequest</b></code></summary>

**Parameters**
No URL Parameters required.

**Request Body**  
No Request Body is required for the GET request

**Responses**
| HTTP Status | response |
|---------------|---------------------------------------------------------------------|
| `200` | `See Below` |
| `500` | `{ "error": "Internal server error" }` |

**Sample Response Body**
```json
[
    {
        "appointmentId": "APP0001",
        "drugName": "Aspirin",
        "drugQuantity": 10,
        "drugPrice": 2.00,
        "requestDate": "2024-06-01"
    },
]
```

</details>

---
_This API Documentation Template was adopted from [azagniotov's REST API Docs in Markdown](https://gist.github.com/azagniotov/a4b16faf0febd12efbc6c3d7370383a6)._