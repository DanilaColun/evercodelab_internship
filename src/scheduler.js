const config = require("./config");
const createLogger = require("./logger");

const log = createLogger(config.appName);

log("scheduler.js started");

function scheduleTask(name, interval, task) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("task name must be a string and not empty");
  }

  if (typeof interval !== "number" || interval <= 0) {
    throw new Error("interval needs to be positive number");
  }

  if (typeof task !== "function") {
    throw new Error("task needs to be a function");
  }

  setInterval(task, interval);
}

scheduleTask("running task", 10000, function () {
  log("running");
});

module.exports = scheduleTask;