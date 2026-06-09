const createApp = require("../src/http/createApp");

const SQLiteCurrencyRepository = require("../src/repositories/sqliteCurrencyRepository");
const SQLitePriceRepository = require("../src/repositories/sqlitePriceRepository");

const createTestDatabase = require("./createTestDatabase");

async function createTestApp(dependencies = {}) {
  const testDatabase = await createTestDatabase();

  const currencyRepository =
    dependencies.currencyRepository ||
    new SQLiteCurrencyRepository({
      db: testDatabase.db,
    });

  const priceRepository =
    dependencies.priceRepository ||
    new SQLitePriceRepository({
      db: testDatabase.db,
    });

  const app = createApp({
    ...dependencies,
    currencyRepository,
    priceRepository,
  });

  return {
    app,
    testDatabase,
    currencyRepository,
    priceRepository,
  };
}

module.exports = createTestApp;
