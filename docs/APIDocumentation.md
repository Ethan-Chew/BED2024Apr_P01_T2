# CareLinc API Documentation
This document outlines the different endpoints contained in the CareLinc Back-End API.  
All related Schemas are located in the [Schema.md](./Schema.md) file.

## Account Authentication/Authorisation
### Login to an Account
<details>
<summary><code>POST</code<code><b>/auth/login</b></code></summary>

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

| http code | response |
|---------------|---------------------------------------------------------------------|
| `200` | `{ message: "Login Successful", account: <account object}` |
| `403` | `{ message: "Incorrect Password" }` |
| `404` | `{ message: "Account with email <email addressnot found." }` |
| `500` | `{ message: "Internal Server Error" }` |
</details>

### Create a New Patient Account
<details>
<summary><code>POST</code<code><b>/auth/create/patient</b></code></summary>

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

**Sample Request Body**
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

| http code | response |
|---------------|---------------------------------------------------------------------|
| `201` | `{ message: "Account Created Successfully", account: <account object}` |
| `500` | `{ message: "Internal Server Error" }` |
</details>

---
_This API Documentation Template was adopted from [azagniotov's REST API Docs in Markdown](https://gist.github.com/azagniotov/a4b16faf0febd12efbc6c3d7370383a6)._