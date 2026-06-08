const SchedulerError = require("../errors/SchedulerError");
const scheduleTask = require("./scheduleTask");

const DEFAULT_PRICE_UPDATE_INTERVAL_MS = 60000;

function startScheduler(dependencies = {}) {
  const {
    logger,
    priceUpdateService,
    intervalMs = Number(
      process.env.PRICE_UPDATE_INTERVAL_MS || DEFAULT_PRICE_UPDATE_INTERVAL_MS
    ),
  } = dependencies;

  if (
    !logger ||
    typeof logger.info !== "function" ||
    typeof logger.warn !== "function" ||
    typeof logger.error !== "function"
  ) {
    throw new SchedulerError("Logger dependency is needed", {
      context: {
        dependency: "logger",
      },
    });
  }

  if (
    !priceUpdateService ||
    typeof priceUpdateService.updateAllPrices !== "function"
  ) {
    throw new SchedulerError("Price update service is needed", {
      context: {
        dependency: "priceUpdateService",
      },
    });
  }

  const requestId = "scheduler-task";

  logger.info("scheduler started", {
    requestId,
  });

  return scheduleTask(
    "price update",
    intervalMs,
    async function () {
      logger.info("price update started", {
        requestId,
      });

      await priceUpdateService.updateAllPrices({
        requestId,
      });
    },
    {
      runImmediately: true,

      onSkip() {
        logger.warn("price update skipped: previous task still running", {
          requestId,
        });
      },

      onError(error) {
        logger.error(`${error.name}: ${error.message}`, {
          requestId,
          context: error.context,
        });
      },
    }
  );
}

module.exports = startScheduler;
