const scheduleTask = require("./scheduleTask");

function startScheduler(dependencies) {
  const logger = dependencies.logger;

  logger.log("scheduler started");

  return scheduleTask("background task", 10000, function () {
    logger.log("background task done");
  });
}

module.exports = startScheduler;