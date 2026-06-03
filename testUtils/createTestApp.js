const createApp = require("../src/http/createApp");
const SQLiteCurrencyRepository = require("../src/repositories/sqliteCurrencyRepository");
const createTestDatabase = require("./createTestDatabase");

async function createTestApp(dependencies = {}) {
  const testDatabase = await createTestDatabase();

  const currencyRepository =
    dependencies.currencyRepository ||
    new SQLiteCurrencyRepository({
      db: testDatabase.db,
    });

  const app = createApp({
    ...dependencies,
    currencyRepository,
  });

  return {
    app,
    testDatabase,
    currencyRepository,
  };
}

module.exports = createTestApp;
