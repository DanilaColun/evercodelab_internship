const SchedulerError = require("../errors/SchedulerError");
const validateTaskOptions = require("../validators/taskValidator");

function scheduleTask(name, interval, task, options = {}) {
  validateTaskOptions(name, interval, task);

  const onError = typeof options.onError === "function" ? options.onError : null;
  const onSkip = typeof options.onSkip === "function" ? options.onSkip : null;
  const runImmediately = options.runImmediately === true;

  let isStopped = false;
  let runningTask = null;

  async function runOnce() {
    if (isStopped) {
      return null;
    }

    if (runningTask) {
      if (onSkip) {
        onSkip({
          name,
          reason: "task is already running",
        });
      }

      return null;
    }

    runningTask = executeTask();

    try {
      return await runningTask;
    } finally {
      runningTask = null;
    }
  }

  async function executeTask() {
    try {
      return await task();
    } catch (error) {
      const originalErrorMessage =
        error instanceof Error ? error.message : String(error);

      const schedulerError = new SchedulerError("Scheduled task failed", {
        context: {
          taskName: name,
          originalErrorMessage,
        },
      });

      if (onError) {
        onError(schedulerError);
      }

      return null;
    }
  }

  const intervalId = setInterval(() => {
    runOnce();
  }, interval);

  if (runImmediately) {
    runOnce();
  }

  async function stop() {
    isStopped = true;
    clearInterval(intervalId);

    if (runningTask) {
      await runningTask;
    }
  }

  return {
    name,
    intervalId,
    runOnce,
    stop,
  };
}

module.exports = scheduleTask;
