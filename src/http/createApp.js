const express = require("express");
const authConfig = require("../config/authConfig");
const CurrencyRepository = require("../repositories/currencyRepository");
const createAuthMiddleware = require("./middlewares/authMiddleware");
const createErrorMiddleware = require("./middlewares/errorMiddleware");
const createRequestIdMiddleware = require("./middlewares/requestIdMiddleware");
const createRequestLoggerMiddleware = require("./middlewares/requestLoggerMiddleware");
const createCurrencyRoutes = require("./routes/currencyRoutes");
const createOpenApiRoutes = require("./routes/openApiRoutes");
const createStatusRoutes = require("./routes/statusRoutes");

function createApp(dependencies = {}) {
  const app = express();

  const currencyRepository =
    dependencies.currencyRepository || new CurrencyRepository();

  const apiToken = dependencies.apiToken || authConfig.apiToken;

  const authMiddleware =
    dependencies.authMiddleware ||
    createAuthMiddleware({
      apiToken
    });

  app.use(createRequestIdMiddleware());
  app.use(createRequestLoggerMiddleware({ logger: dependencies.logger }));
  app.use(express.json());

  app.use(createStatusRoutes(dependencies));
  app.use(createOpenApiRoutes());

  app.use("/api", authMiddleware);
  app.use("/api/currencies", createCurrencyRoutes({ currencyRepository }));

  app.use(createErrorMiddleware({ logger: dependencies.logger }));

  return app;
}

module.exports = createApp;
