function createLogger(appName) {
  return function log(message) {
    console.log(`[${appName}] ${message}`);
  };
}

module.exports = createLogger;