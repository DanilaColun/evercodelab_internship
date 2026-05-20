const SchedulerError = require("../errors/SchedulerError");
const scheduleTask = require("./scheduleTask");

function startScheduler(dependencies = {}) {
  const logger = dependencies.logger;

  if (
    !logger ||
    typeof logger.info !== "function" ||
    typeof logger.error !== "function"
  ) {
    throw new SchedulerError("Logger dependency is needed", {
      context: {
        dependency: "logger"
      }
    });
  }

  const requestId = "scheduler-task";

  logger.info("scheduler started", { requestId });

  return scheduleTask(
    "background task",
    10000,
    async function () {
      logger.info("background task done", { requestId });
    },
    {
      onError(error) {
        logger.error(`${error.name}: ${error.message}`, { requestId });
      }
    }
  );
}

module.exports = startScheduler;