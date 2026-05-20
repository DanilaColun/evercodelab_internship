const appConfig = require("./config/appConfig");
const Logger = require("./logger/Logger");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel
});

logger.info("app started");