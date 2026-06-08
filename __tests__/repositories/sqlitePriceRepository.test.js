const createTestDatabase = require("../../testUtils/createTestDatabase");
const SQLiteCurrencyRepository = require("../../src/repositories/sqliteCurrencyRepository");
const SQLitePriceRepository = require("../../src/repositories/sqlitePriceRepository");

describe("SQLitePriceRepository", () => {
  let testDatabase;
  let currencyRepository;
  let priceRepository;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();

    currencyRepository = new SQLiteCurrencyRepository({
      db: testDatabase.db,
    });

    priceRepository = new SQLitePriceRepository({
      db: testDatabase.db,
    });

    await currencyRepository.create({
      name: "Bitcoin",
      ticker: "BTC",
    });
  });

  afterEach(async () => {
    await testDatabase.close();
  });

  test("saves and returns prices by ticker", async () => {
    await priceRepository.replaceForCurrencyTicker("BTC", [
      {
        symbol: "BTCUSDT",
        price: "68000.00000000",
      },
      {
        symbol: "ETHBTC",
        price: "0.05200000",
      },
    ]);

    const prices = await priceRepository.findByCurrencyTicker("BTC");

    expect(prices).toEqual([
      {
        symbol: "BTCUSDT",
        price: "68000.00000000",
      },
      {
        symbol: "ETHBTC",
        price: "0.05200000",
      },
    ]);
  });

  test("replaces old prices with new prices", async () => {
    await priceRepository.replaceForCurrencyTicker("BTC", [
      {
        symbol: "BTCUSDT",
        price: "68000.00000000",
      },
    ]);

    await priceRepository.replaceForCurrencyTicker("BTC", [
      {
        symbol: "BTCUSDT",
        price: "69000.00000000",
      },
      {
        symbol: "BNBBTC",
        price: "0.00400000",
      },
    ]);

    const prices = await priceRepository.findByCurrencyTicker("BTC");

    expect(prices).toEqual([
      {
        symbol: "BNBBTC",
        price: "0.00400000",
      },
      {
        symbol: "BTCUSDT",
        price: "69000.00000000",
      },
    ]);
  });

  test("returns empty array if prices are not loaded", async () => {
    const prices = await priceRepository.findByCurrencyTicker("BTC");

    expect(prices).toEqual([]);
  });
});
