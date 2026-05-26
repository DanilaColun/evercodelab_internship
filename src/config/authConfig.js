require("dotenv").config();

const authConfig = {
  apiToken: process.env.API_TOKEN || "",
};

module.exports = authConfig;
