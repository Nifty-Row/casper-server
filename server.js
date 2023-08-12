require("dotenv").config();

const app = require("./app");
const swaggerDocs = require("./utils/swagger");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  swaggerDocs(app, PORT);
  console.info(`Server running on port ${PORT}`);
});
