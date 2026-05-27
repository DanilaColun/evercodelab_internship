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
const BinanceService = require("../services/binanceService");
const PriceService = require("../services/priceService");
const createPriceRoutes = require("./routes/priceRoutes");

function createApp(dependencies = {}) {
  const app = express();

  const currencyRepository =
    dependencies.currencyRepository || new CurrencyRepository();

  const binanceService =
    dependencies.binanceService ||
    new BinanceService({
      logger: dependencies.logger
    });

  const priceService =
    dependencies.priceService ||
    new PriceService({
      currencyRepository,
      binanceService
    });

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

  app.use("/price", authMiddleware);
  app.use("/price", createPriceRoutes({ priceService }));

  app.use(createErrorMiddleware({ logger: dependencies.logger }));

  return app;
}

module.exports = createApp;
