const validateTaskOptions = require("../validators/taskValidator");

function scheduleTask(name, interval, task) {
  validateTaskOptions(name, interval, task);

  const intervalId = setInterval(task, interval);

  return intervalId;
}

module.exports = scheduleTask;