const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

const doc = {
  info: {
    title: "CareLinc Backend API",
    description: "Outlines the different endpoints contained in the CareLinc Back-End API. These API Endpoints handle the management of accounts, appointment bookings, inventory management and other operations that are crucial to the functioning of the CareLinc platform.",
  },
  host: "localhost:3000",
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter your bearer token in the format **Bearer &lt;token&gt;**",
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "Endpoints related to authentication and authorisation operations (login, create account, etc)",
    },
    {
      name: "Admin",
      description: "Endpoints related to admin operations",
    },
    {
      name: "Patient",
      description: "Endpoints related to patient operations",
    },
    {
      name: "Company",
      description: "Endpoints related to company operations",
    },
    {
      name: "Doctor",
      description: "Endpoints related to doctor operations",
    },
    {
      name: "Pay-it-Forward",
      description: "Endpoints related to the Pay-it-Forward program, allowing patients, doctors and companies to manage requests for help",
    },
    {
      name: "Inventory",
      description: "Endpoints related to drug inventory management",
    },
    {
      name: "Appointments",
      description: "Endpoints related to appointment scheduling and availability",
    },
    {
      name: "Notifications",
      description: "Endpoints related to notifications",
    },
    {
      name: "Chatbot",
      description: "Endpoints related to chatbot operations, allowing patients to interact with the chatbot",
    },
    {
      name: "Mail",
      description: "Endpoints related to mail operations which sends patients a payment confirmation email",
    }
  ],
  paths: {}
};

// Sort each API Endpoint into it's respective tags
const tagsWithCategory = {
  "Authentication": [
    "generateQRCode", "getAuth", "verify2FA", "auth"
  ],
  "Company": [
    "company", "drugRequests", "drugRequest", "drugContributionOrders"
  ],
  "Patient": [
    "patient", "patients", "paymentMethod", "paymentMethods", "questionnaire"
  ],
  "Doctor": [
    "doctors",
  ],
  "Admin": [
    "staff", "patients/unapproved", "drugTopup"
  ],
  "Pay-it-Forward": [
    "helpRequests", "paymentRequests", "paymentRequest"
  ],
  "Inventory": [
    "drugInventory", "companyDrugInventory", "drugInventoryRecord", "inventoryRecord"
  ],
  "Appointments": [
    "appointment", "appointments", "availableSlot", "availableSlots"
  ],
  "Notifications": [
    "notification", "notifications"
  ],
  "Chatbot": [
    "chatbot"
  ],
  "Mail": [
    "mail"
  ]
};

const addTagsToPaths = (paths, tagsConfig) => {
  Object.keys(paths).forEach((path) => {
    Object.entries(tagsConfig).forEach(([tag, keywords]) => {
      if (keywords.some((keyword) => path.startsWith(`/api/${keyword}`))) {
        Object.keys(paths[path]).forEach((method) => {
          paths[path][method].tags = [tag];
        });
      }
    });
  });
  return paths;
};

// Generate the swagger output
swaggerAutogen(outputFile, routes, doc).then(() => {
  // Read the generated file
  const fs = require('fs');
  const generatedDoc = require(outputFile);

  // Add the Company tag to specific paths
  generatedDoc.paths = addTagsToPaths(generatedDoc.paths, tagsWithCategory);

  // Write the modified document back to the file
  fs.writeFileSync(outputFile, JSON.stringify(generatedDoc, null, 2));
});