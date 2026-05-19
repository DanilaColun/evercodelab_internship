const SchedulerError = require("../errors/SchedulerError");
const scheduleTask = require("./scheduleTask");

function startScheduler(dependencies = {}) {
  const logger = dependencies.logger;

  if (!logger || typeof logger.log !== "function") {
    throw new SchedulerError("Logger dependency is needed", {
      context: {
        dependency: "logger"
      }
    });
  }

  logger.log("scheduler started");

  return scheduleTask(
    "background task",
    10000,
    async function () {
      logger.log("background task done");
    },
    {
      onError(error) {
        logger.log(`${error.name}: ${error.message}`);
      }
    }
  );
}

module.exports = startScheduler;