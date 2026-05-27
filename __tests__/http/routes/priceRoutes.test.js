const request = require("supertest");
const createApp = require("../../../src/http/createApp");
const CurrencyRepository = require("../../../src/repositories/currencyRepository");

const validToken = "a9f4c2d8e13b7a0c91f6e84d22b0c5713e69f10ab8d4567c3f92a4410dc88b5e";

function createTestApp() {
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

  return createApp({
    apiToken: validToken,
    currencyRepository,
    binanceService
  });
}

function withAuth(requestBuilder) {
  return requestBuilder.set("Authorization", `Bearer ${validToken}`);
}

describe("price routes", () => {
  test("blocks request without token", async () => {
    const app = createTestApp();

    const response = await request(app).get("/price?currency=BTC").expect(403);

    expect(response.body.error).toBe("Forbidden");
  });

  test("returns prices for currency", async () => {
    const app = createTestApp();

    await withAuth(request(app).get("/price?currency=BTC"))
      .expect(200)
      .expect({
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

  test("returns 400 if currency query is missing", async () => {
    const app = createTestApp();

    const response = await withAuth(request(app).get("/price")).expect(400);

    expect(response.body.error).toBe("Currency is required");
  });

  test("returns 404 if currency is not in database", async () => {
    const app = createTestApp();

    const response = await withAuth(
      request(app).get("/price?currency=ETH")
    ).expect(404);

    expect(response.body.error).toBe("Currency not found");
  });
});
