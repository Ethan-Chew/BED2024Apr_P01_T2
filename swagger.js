const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

const doc = {
  info: {
    title: "CareLinc Backend API",
    description: "Outlines the different endpoints contained in the CareLinc Back-End API. These API Endpoints handle the management of accounts, appointment bookings, inventory management and other operations that are crucial to the functioning of the CareLinc platform.",
  },
  host: "localhost:3000",
  tags: [
    {
      name: "Authentication",
      description: "Endpoints related to authentication and authorisation operations",
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
    "drugRequests", "drugRequest", "drugContributionOrders",
    "drugInventoryRecord", "companyDrugInventory", "inventoryRecord", "company"
  ],
  "Patient": [
    "patient", "patients", "paymentMethod", "paymentMethods", "mail",
    "chatbot", "appointments", "notification", "notifications", "questionnaire"
  ],
  "Doctor": [
    "doctors", "appointment", "appointments", "availableSlot", "availableSlots",
    "paymentRequests", "paymentRequest"
  ],
  "Admin": [
    "staff", "patients/unapproved", "drugTopup", "drugInventory", "helpRequests"
  ],
};

const addTagsToPaths = (paths, tagsConfig) => {
  Object.keys(paths).forEach((path) => {
    Object.entries(tagsConfig).forEach(([tag, keywords]) => {
      if (keywords.some((keyword) => path.startsWith(`/api/${keyword}`))) {
        Object.keys(paths[path]).forEach((method) => {
          if (!paths[path][method].tags) {
            paths[path][method].tags = [];
          }
          if (!paths[path][method].tags.includes(tag)) {
            paths[path][method].tags.push(tag);
          }
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