const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function openDatabase(options) {
  return open({
    filename: options.filename,
    driver: sqlite3.Database,
  });
}

module.exports = openDatabase;
