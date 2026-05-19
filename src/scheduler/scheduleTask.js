const SchedulerError = require("../errors/SchedulerError");
const validateTaskOptions = require("../validators/taskValidator");

function scheduleTask(name, interval, task, options = {}) {
  validateTaskOptions(name, interval, task);

  const onError = typeof options.onError === "function" ? options.onError : null;

  const intervalId = setInterval(async function () {
    try {
      await task();
    } catch (error) {
      const schedulerError = new SchedulerError("Scheduled task failed", {
        context: {
          taskName: name,
          originalErrorMessage: error.message
        }
      });

      if (onError) {
        onError(schedulerError);
      }
    }
  }, interval);

  return intervalId;
}

module.exports = scheduleTask;