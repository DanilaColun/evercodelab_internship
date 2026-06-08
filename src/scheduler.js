const appConfig = require("./config/appConfig");
const databaseConfig = require("./database/databaseConfig");
const initDatabase = require("./database/initDatabase");
const openDatabase = require("./database/databaseConnection");

const Logger = require("./logger/logger");

const SQLiteCurrencyRepository = require("./repositories/sqliteCurrencyRepository");
const SQLitePriceRepository = require("./repositories/sqlitePriceRepository");

const BinanceService = require("./services/binanceService");
const PriceUpdateService = require("./services/priceUpdateService");

const startScheduler = require("./scheduler/startScheduler");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel,
});

let isShuttingDown = false;

async function startSchedulerProcess() {
  let db;
  let scheduler;

  try {
    await initDatabase({
      filename: databaseConfig.filename,
    });

    db = await openDatabase({
      filename: databaseConfig.filename,
    });

    const currencyRepository = new SQLiteCurrencyRepository({
      db,
    });

    const priceRepository = new SQLitePriceRepository({
      db,
    });

    const binanceService = new BinanceService({
      logger,
    });

    const priceUpdateService = new PriceUpdateService({
      currencyRepository,
      priceRepository,
      binanceService,
      logger,
    });

    scheduler = startScheduler({
      logger,
      priceUpdateService,
    });

    async function shutdown(signal) {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      logger.info(`scheduler shutdown started by ${signal}`);

      try {
        if (scheduler) {
          await scheduler.stop();
          logger.info("scheduler stopped");
        }

        if (db) {
          await db.close();
          logger.info("database connection closed");
        }

        process.exit(0);
      } catch (error) {
        logger.error(`scheduler shutdown failed: ${error.message}`);
        process.exit(1);
      }
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(`scheduler failed to start: ${error.message}`);

    if (scheduler) {
      await scheduler.stop().catch(() => {});
    }

    if (db) {
      await db.close().catch(() => {});
    }

    process.exit(1);
  }
}

if (require.main === module) {
  startSchedulerProcess();
}

module.exports = startSchedulerProcess;
