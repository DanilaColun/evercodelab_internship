const SQLiteCurrencyRepository = require("../../src/repositories/sqliteCurrencyRepository");
const createTestDatabase = require("../../testUtils/createTestDatabase");
const ConflictError = require("../../src/errors/ConflictError");

describe("SQLiteCurrencyRepository", () => {
  let testDatabase;
  let repository;

  beforeEach(async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    testDatabase = await createTestDatabase();

    repository = new SQLiteCurrencyRepository({
      db: testDatabase.db,
    });
  });

  afterEach(async () => {
    if (testDatabase) {
      await testDatabase.close();
    }

    jest.restoreAllMocks();
  });

  test("returns empty currency list", async () => {
    const currencies = await repository.findAll();

    expect(currencies).toEqual([]);
  });

  test("creates currency and normalizes ticker", async () => {
    const currency = await repository.create({
      name: "Bitcoin",
      ticker: "btc",
    });

    expect(currency).toEqual({
      name: "Bitcoin",
      ticker: "BTC",
    });

    const currencies = await repository.findAll();

    expect(currencies).toEqual([
      {
        name: "Bitcoin",
        ticker: "BTC",
      },
    ]);
  });

  test("finds currency by ticker", async () => {
    await repository.create({
      name: "Bitcoin",
      ticker: "BTC",
    });

    const currency = await repository.findByTicker("btc");

    expect(currency).toEqual({
      name: "Bitcoin",
      ticker: "BTC",
    });
  });

  test("updates currency", async () => {
    await repository.create({
      name: "Bitcoin",
      ticker: "BTC",
    });

    const updatedCurrency = await repository.update("btc", {
      name: "Bitcoin new",
      ticker: "BTC",
    });

    expect(updatedCurrency).toEqual({
      name: "Bitcoin new",
      ticker: "BTC",
    });

    const currency = await repository.findByTicker("BTC");

    expect(currency).toEqual({
      name: "Bitcoin new",
      ticker: "BTC",
    });
  });

  test("returns null when updating missing currency", async () => {
    const updatedCurrency = await repository.update("BTC", {
      name: "Bitcoin",
      ticker: "BTC",
    });

    expect(updatedCurrency).toBeNull();
  });

  test("deletes currency", async () => {
    await repository.create({
      name: "Bitcoin",
      ticker: "BTC",
    });

    const isDeleted = await repository.delete("btc");

    expect(isDeleted).toBe(true);
    expect(await repository.findByTicker("BTC")).toBeNull();
  });

  test("returns false when deleting missing currency", async () => {
    const isDeleted = await repository.delete("BTC");

    expect(isDeleted).toBe(false);
  });

  test("checks if currency exists", async () => {
    await repository.create({
      name: "Bitcoin",
      ticker: "BTC",
    });

    expect(await repository.exists("btc")).toBe(true);
    expect(await repository.exists("eth")).toBe(false);
  });

  test("does not treat ticker value as SQL code", async () => {
    await repository.create({
      name: "Bitcoin",
      ticker: "BTC",
    });

    const maliciousTicker = "BTC' OR '1'='1";

    const currency = await repository.findByTicker(maliciousTicker);
    const isDeleted = await repository.delete(maliciousTicker);

    expect(currency).toBeNull();
    expect(isDeleted).toBe(false);

    expect(await repository.findByTicker("BTC")).toEqual({
      name: "Bitcoin",
      ticker: "BTC",
    });
  });

    test("throws ConflictError when creating duplicate currency", async () => {
    await repository.create({
      name: "Bitcoin",
      ticker: "BTC"
    });

    await expect(
      repository.create({
        name: "Bitcoin",
        ticker: "BTC"
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  test("uses transaction runner for write operations", async () => {
    const transactionRunner = jest.fn((db, action) => {
      return action();
    });

    const repositoryWithTransactionSpy = new SQLiteCurrencyRepository({
      db: testDatabase.db,
      transactionRunner
    });

    await repositoryWithTransactionSpy.create({
      name: "Bitcoin",
      ticker: "BTC"
    });

    await repositoryWithTransactionSpy.update("BTC", {
      name: "Bitcoin Updated",
      ticker: "BTC"
    });

    await repositoryWithTransactionSpy.delete("BTC");

    expect(transactionRunner).toHaveBeenCalledTimes(3);
  });


});
