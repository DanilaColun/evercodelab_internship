const express = require("express");
const createStatusRoutes = require("./routes/statusRoutes");

function createApp(dependencies = {}) {
  const app = express();

  app.use(express.json());

  app.use(createStatusRoutes(dependencies));

  return app;
}

module.exports = createApp;
