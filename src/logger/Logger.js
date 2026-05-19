const ConfigError = require("../errors/ConfigError");

class Logger {
  constructor(appName) {
    if (typeof appName !== "string" || appName.trim() === "") {
      throw new ConfigError("app name needs to be provided", {
        context: {
          field: "appName",
          value: appName
        }
      });
    }

    this.appName = appName;
  }

  log(message) {
    console.log(`[${this.appName}] ${String(message)}`);
  }
}

module.exports = Logger;
