const appConfig = require("./config/appConfig");
const Logger = require("./logger/logger");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel
});

logger.info("app started");