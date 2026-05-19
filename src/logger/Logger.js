class Logger {
  constructor(appName) {
    if (typeof appName !== "string" || appName.trim() === "") {
      throw new Error("app name needs to be provided");
    }

    this.appName = appName;
  }

  log(message) {
    console.log(`[${this.appName}] ${String(message)}`);
  }
}

module.exports = Logger;