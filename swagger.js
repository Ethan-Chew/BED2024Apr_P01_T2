const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

const doc = {
  info: {
    title: "CareLinc Backend API",
    description: "Outlines the different endpoints contained in the CareLinc Back-End API.",
  },
  host: "localhost:3000",
  tags: [
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
      description: "Endpoints related to company operations (Jefferson)",
    },
    {
      name: "Doctor",
      description: "Endpoints related to doctor operations",
    }
  ],
  paths: {}
};

// swaggerAutogen(outputFile, routes, doc);

// Function to add Company tag to specific paths
const addCompanyTag = (paths) => {
  Object.keys(paths).forEach((path) => {
    if (path.startsWith("/api/drugRequests") || path.startsWith("/api/drugRequest") || path.startsWith("/api/drugContributionOrders") || path.startsWith("/api/drugInventoryRecord") || path.startsWith("/api/companyDrugInventory") || path.startsWith("/api/inventoryRecord")) {
      Object.keys(paths[path]).forEach((method) => {
        paths[path][method].tags = ["Company"];
      });
    }
  });
  return paths;
};

// Generate the swagger output
swaggerAutogen(outputFile, routes, doc).then(() => {
  // Read the generated file
  const fs = require('fs');
  const generatedDoc = require(outputFile);

  // Add the Company tag to specific paths
  generatedDoc.paths = addCompanyTag(generatedDoc.paths);

  // Write the modified document back to the file
  fs.writeFileSync(outputFile, JSON.stringify(generatedDoc, null, 2));
});