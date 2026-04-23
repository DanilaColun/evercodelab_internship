function createLogger(appName) {
  if (typeof appName !== "string" || appName.trim() === "") {
    throw new Error("app name needs to be a string and not empty");
  }

  return function log(message) {
    console.log(`[${appName}] ${String(message)}`);
  };
}

module.exports = createLogger;