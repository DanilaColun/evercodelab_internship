const appConfig = require("./config/appConfig");
const Logger = require("./logger/Logger");
const startScheduler = require("./scheduler/startScheduler");

const logger = new Logger(appConfig.appName);

startScheduler({ logger });