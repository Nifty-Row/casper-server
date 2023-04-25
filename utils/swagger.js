const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yasuke Casper Server API Docs",
      version,
    },
  },
  apis: ["../routes/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("docs.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.info(`Docs available at http://localhost:${port}/docs`);
}

module.exports = swaggerDocs;
