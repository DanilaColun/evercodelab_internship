const config = require("./config");
const createLogger = require("./logger");

const log = createLogger(config.appName);

log("app started");