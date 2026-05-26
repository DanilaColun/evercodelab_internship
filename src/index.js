const appConfig = require("./config/appConfig");
const Logger = require("./logger/logger");
const createApp = require("./http/createApp");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel,
});

const app = createApp({
  logger,
});

app.listen(appConfig.port, () => {
  logger.info(`app started on port ${appConfig.port}`);
});
