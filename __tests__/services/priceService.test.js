const ConfigError = require("../../src/errors/ConfigError");
const NotFoundError = require("../../src/errors/NotFoundError");
const PriceService = require("../../src/services/priceService");

function createCurrencyRepository(currencies = []) {
  return {
    findByTicker: jest.fn(async (ticker) => {
      return (
        currencies.find((currency) => {
          return currency.ticker === ticker;
        }) || null
      );
    }),
  };
}

describe("PriceService", () => {
  test("returns cached prices by currency", async () => {
    const currencyRepository = createCurrencyRepository([
      {
        name: "Bitcoin",
        ticker: "BTC",
      },
    ]);

    const priceRepository = {
      findByCurrencyTicker: jest.fn().mockResolvedValue([
        {
          symbol: "BTCUSDT",
          price: "68000.00000000",
        },
        {
          symbol: "ETHBTC",
          price: "0.05200000",
        },
      ]),
    };

    const priceService = new PriceService({
      currencyRepository,
      priceRepository,
    });

    const result = await priceService.getPricesByCurrency("btc");

    expect(result).toEqual({
      currency: "BTC",
      prices: [
        {
          symbol: "BTCUSDT",
          price: "68000.00000000",
        },
        {
          symbol: "ETHBTC",
          price: "0.05200000",
        },
      ],
    });

    expect(currencyRepository.findByTicker).toHaveBeenCalledWith("BTC");
    expect(priceRepository.findByCurrencyTicker).toHaveBeenCalledWith("BTC");
  });

  test("throws not found if currency is not in database", async () => {
    const currencyRepository = createCurrencyRepository();

    const priceRepository = {
      findByCurrencyTicker: jest.fn(),
    };

    const priceService = new PriceService({
      currencyRepository,
      priceRepository,
    });

    await expect(priceService.getPricesByCurrency("BTC")).rejects.toBeInstanceOf(
      NotFoundError
    );

    expect(priceRepository.findByCurrencyTicker).not.toHaveBeenCalled();
  });

  test("throws config error if currency repository is missing", () => {
    expect(() => {
      new PriceService({
        priceRepository: {},
      });
    }).toThrow(ConfigError);
  });

  test("throws config error if price repository is missing", () => {
    expect(() => {
      new PriceService({
        currencyRepository: {},
      });
    }).toThrow(ConfigError);
  });
});
