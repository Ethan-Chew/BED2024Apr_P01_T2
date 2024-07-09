const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

const doc = {
  info: {
    title: "CareLinc Backend API",
    description: "Outlines the different endpoints contained in the CareLinc Back-End API.",
  },
  host: "localhost:3000",
};

swaggerAutogen(outputFile, routes, doc);