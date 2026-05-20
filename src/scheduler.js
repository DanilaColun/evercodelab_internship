const appConfig = require("./config/appConfig");
const Logger = require("./logger/logger");
const startScheduler = require("./scheduler/startScheduler");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel
});

startScheduler({ logger });