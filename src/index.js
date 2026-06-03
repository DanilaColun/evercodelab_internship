const appConfig = require("./config/appConfig");
const databaseConfig = require("./database/databaseConfig");
const initDatabase = require("./database/initDatabase");
const openDatabase = require("./database/databaseConnection");
const createApp = require("./http/createApp");
const Logger = require("./logger/logger");
const SQLiteCurrencyRepository = require("./repositories/sqliteCurrencyRepository");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel,
});

let isShuttingDown = false;

async function startServer() {
  let db;

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

    const app = createApp({
      logger,
      currencyRepository,
    });

    const server = app.listen(appConfig.port, () => {
      logger.info(`app started on port ${appConfig.port}`);
    });

    async function shutdown(signal) {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      logger.info(`app shutdown started by ${signal}`);

      server.close(async () => {
        try {
          await db.close();
          logger.info("database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error(`database connection close failed: ${error.message}`);
          process.exit(1);
        }
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(`app failed to start: ${error.message}`);

    if (db) {
      await db.close().catch(() => {});
    }

    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = startServer;
