const path = require("path");

const databaseConfig = {
  filename: process.env.DATABASE_FILE || path.join(process.cwd(), "data", "app.sqlite"),
};

module.exports = databaseConfig;
