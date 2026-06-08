const ConfigError = require("../../src/errors/ConfigError");
const PriceUpdateService = require("../../src/services/priceUpdateService");

function createLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

describe("PriceUpdateService", () => {
  test("updates prices for all currencies", async () => {
    const currencyRepository = {
      findAll: jest.fn().mockResolvedValue([
        {
          name: "Bitcoin",
          ticker: "BTC",
        },
        {
          name: "Ethereum",
          ticker: "ETH",
        },
      ]),
    };

    const priceRepository = {
      replaceForCurrencyTicker: jest.fn().mockResolvedValue({
        pricesCount: 2,
      }),
    };

    const binanceService = {
      getAllPrices: jest.fn().mockResolvedValue([
        {
          symbol: "BTCUSDT",
          price: "68000.00000000",
        },
        {
          symbol: "ETHBTC",
          price: "0.05200000",
        },
        {
          symbol: "ETHUSDT",
          price: "3500.00000000",
        },
      ]),
    };

    const logger = createLogger();

    const priceUpdateService = new PriceUpdateService({
      currencyRepository,
      priceRepository,
      binanceService,
      logger,
    });

    const result = await priceUpdateService.updateAllPrices({
      requestId: "test-request",
    });

    expect(currencyRepository.findAll).toHaveBeenCalledTimes(1);

    expect(binanceService.getAllPrices).toHaveBeenCalledWith({
      requestId: "test-request",
    });

    expect(priceRepository.replaceForCurrencyTicker).toHaveBeenCalledWith("BTC", [
      {
        symbol: "BTCUSDT",
        price: "68000.00000000",
      },
      {
        symbol: "ETHBTC",
        price: "0.05200000",
      },
    ]);

    expect(priceRepository.replaceForCurrencyTicker).toHaveBeenCalledWith("ETH", [
      {
        symbol: "ETHBTC",
        price: "0.05200000",
      },
      {
        symbol: "ETHUSDT",
        price: "3500.00000000",
      },
    ]);

    expect(result.updatedCurrencies).toBe(2);
    expect(result.updatedPrices).toBe(4);
    expect(result.durationMs).toEqual(expect.any(Number));
  });

  test("skips Binance request if there are no currencies", async () => {
    const currencyRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    const priceRepository = {
      replaceForCurrencyTicker: jest.fn(),
    };

    const binanceService = {
      getAllPrices: jest.fn(),
    };

    const logger = createLogger();

    const priceUpdateService = new PriceUpdateService({
      currencyRepository,
      priceRepository,
      binanceService,
      logger,
    });

    const result = await priceUpdateService.updateAllPrices({
      requestId: "test-request",
    });

    expect(binanceService.getAllPrices).not.toHaveBeenCalled();
    expect(priceRepository.replaceForCurrencyTicker).not.toHaveBeenCalled();

    expect(result).toEqual({
      updatedCurrencies: 0,
      updatedPrices: 0,
      durationMs: expect.any(Number),
    });
  });

  test("throws error if Binance request fails", async () => {
    const currencyRepository = {
      findAll: jest.fn().mockResolvedValue([
        {
          name: "Bitcoin",
          ticker: "BTC",
        },
      ]),
    };

    const priceRepository = {
      replaceForCurrencyTicker: jest.fn(),
    };

    const binanceService = {
      getAllPrices: jest.fn().mockRejectedValue(new Error("Binance failed")),
    };

    const logger = createLogger();

    const priceUpdateService = new PriceUpdateService({
      currencyRepository,
      priceRepository,
      binanceService,
      logger,
    });

    await expect(
      priceUpdateService.updateAllPrices({
        requestId: "test-request",
      })
    ).rejects.toThrow("Binance failed");

    expect(priceRepository.replaceForCurrencyTicker).not.toHaveBeenCalled();
  });

  test("throws config error if currency repository is missing", () => {
    expect(() => {
      new PriceUpdateService({
        priceRepository: {},
        binanceService: {},
      });
    }).toThrow(ConfigError);
  });

  test("throws config error if price repository is missing", () => {
    expect(() => {
      new PriceUpdateService({
        currencyRepository: {},
        binanceService: {},
      });
    }).toThrow(ConfigError);
  });

  test("throws config error if Binance service is missing", () => {
    expect(() => {
      new PriceUpdateService({
        currencyRepository: {},
        priceRepository: {},
      });
    }).toThrow(ConfigError);
  });
});
