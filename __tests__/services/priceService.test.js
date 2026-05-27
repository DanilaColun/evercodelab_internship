const PriceService = require("../../src/services/priceService");
const CurrencyRepository = require("../../src/repositories/currencyRepository");
const NotFoundError = require("../../src/errors/NotFoundError");

describe("PriceService", () => {
  test("returns prices that contain currency", async () => {
    const currencyRepository = new CurrencyRepository([
      {
        name: "Bitcoin",
        ticker: "BTC"
      }
    ]);

    const binanceService = {
      getAllPrices: jest.fn().mockResolvedValue([
        {
          symbol: "BTCUSDT",
          price: "68000.00000000"
        },
        {
          symbol: "ETHBTC",
          price: "0.05200000"
        },
        {
          symbol: "ETHUSDT",
          price: "3500.00000000"
        }
      ])
    };

    const priceService = new PriceService({
      currencyRepository,
      binanceService
    });

    const result = await priceService.getPricesByCurrency("BTC");

    expect(result).toEqual({
      currency: "BTC",
      prices: [
        {
          symbol: "BTCUSDT",
          price: "68000.00000000"
        },
        {
          symbol: "ETHBTC",
          price: "0.05200000"
        }
      ]
    });
  });

  test("throws not found if currency is not in database", async () => {
    const currencyRepository = new CurrencyRepository();
    const binanceService = {
      getAllPrices: jest.fn()
    };

    const priceService = new PriceService({
      currencyRepository,
      binanceService
    });

    await expect(priceService.getPricesByCurrency("BTC")).rejects.toBeInstanceOf(
      NotFoundError
    );

    expect(binanceService.getAllPrices).not.toHaveBeenCalled();
  });
});
