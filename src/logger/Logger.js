const ConfigError = require("../errors/ConfigError");

class Logger {
  constructor(appName, options = {}) {
    if (typeof appName !== "string" || appName.trim() === "") {
      throw new ConfigError("app name needs to be provided", {
        context: {
          field: "appName",
          value: appName
        }
      });
    }

    this.appName = appName;

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };

    this.level = options.level || "info";

    if (!Object.prototype.hasOwnProperty.call(this.levels, this.level)) {
      throw new ConfigError("unknown log level", {
        context: {
          field: "level",
          value: this.level,
          allowedValues: Object.keys(this.levels)
        }
      });
    }
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  formatMessage(level, message, options = {}) {
    const timestamp = new Date().toISOString();
    const requestId = options.requestId ? ` [requestId=${options.requestId}]` : "";

    return `[${timestamp}] [${level.toUpperCase()}] [${this.appName}]${requestId} ${String(message)}`;
  }

  write(level, message, options = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, options);

    if (level === "error") {
      console.error(formattedMessage);
      return;
    }

    if (level === "warn") {
      console.warn(formattedMessage);
      return;
    }

    console.log(formattedMessage);
  }

  error(message, options = {}) {
    this.write("error", message, options);
  }

  warn(message, options = {}) {
    this.write("warn", message, options);
  }

  info(message, options = {}) {
    this.write("info", message, options);
  }

  debug(message, options = {}) {
    this.write("debug", message, options);
  }

  trace(message, options = {}) {
    this.write("trace", message, options);
  }

  log(message, options = {}) {
    this.info(message, options);
  }
}

module.exports = Logger;