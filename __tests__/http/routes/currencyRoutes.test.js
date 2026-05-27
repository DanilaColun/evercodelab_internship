const request = require("supertest");
const createApp = require("../../../src/http/createApp");
const CurrencyRepository = require("../../../src/repositories/currencyRepository");

const validToken = "a9f4c2d8e13b7a0c91f6e84d22b0c5713e69f10ab8d4567c3f92a4410dc88b5e";

function createTestApp() {
  return createApp({
    apiToken: validToken,
    currencyRepository: new CurrencyRepository()
  });
}

function withAuth(requestBuilder) {
  return requestBuilder.set("Authorization", `Bearer ${validToken}`);
}

describe("currency routes", () => {
  test("blocks request without token", async () => {
    const app = createTestApp();

    const response = await request(app).get("/api/currencies").expect(403);

    expect(response.body.error).toBe("Forbidden");
  });

  test("returns empty currency list", async () => {
    const app = createTestApp();

    await withAuth(request(app).get("/api/currencies")).expect(200).expect([]);
  });

  test("creates currency", async () => {
    const app = createTestApp();

    await withAuth(request(app).post("/api/currencies"))
      .send({
        name: "Bitcoin",
        ticker: "btc"
      })
      .expect(201)
      .expect({
        name: "Bitcoin",
        ticker: "BTC"
      });
  });

  test("does not create currency with empty data", async () => {
    const app = createTestApp();

    const response = await withAuth(request(app).post("/api/currencies"))
      .send({})
      .expect(400);

    expect(response.body.error).toBe("Invalid currency data");
    expect(response.body.details).toEqual([
      "Name is required",
      "Ticker is required"
    ]);
  });

  test("does not create duplicate currency", async () => {
    const app = createTestApp();

    await withAuth(request(app).post("/api/currencies")).send({
      name: "Bitcoin",
      ticker: "BTC"
    });

    const response = await withAuth(request(app).post("/api/currencies"))
      .send({
        name: "Bitcoin",
        ticker: "BTC"
      })
      .expect(409);

    expect(response.body.error).toBe("Currency already exists");
  });

  test("returns currency by ticker", async () => {
    const app = createTestApp();

    await withAuth(request(app).post("/api/currencies")).send({
      name: "Bitcoin",
      ticker: "BTC"
    });

    await withAuth(request(app).get("/api/currencies/btc"))
      .expect(200)
      .expect({
        name: "Bitcoin",
        ticker: "BTC"
      });
  });

  test("returns 404 if currency does not exist", async () => {
    const app = createTestApp();

    const response = await withAuth(
      request(app).get("/api/currencies/BTC")
    ).expect(404);

    expect(response.body.error).toBe("Currency not found");
  });

  test("updates currency", async () => {
    const app = createTestApp();

    await withAuth(request(app).post("/api/currencies")).send({
      name: "Bitcoin",
      ticker: "BTC"
    });

    await withAuth(request(app).put("/api/currencies/BTC"))
      .send({
        name: "Bitcoin new",
        ticker: "BTC"
      })
      .expect(200)
      .expect({
        name: "Bitcoin new",
        ticker: "BTC"
      });
  });

  test("does not update if ticker does not match URL", async () => {
    const app = createTestApp();

    const response = await withAuth(request(app).put("/api/currencies/BTC"))
      .send({
        name: "Ethereum",
        ticker: "ETH"
      })
      .expect(400);

    expect(response.body.error).toBe("Ticker must match URL");
  });

  test("deletes currency", async () => {
    const app = createTestApp();

    await withAuth(request(app).post("/api/currencies")).send({
      name: "Bitcoin",
      ticker: "BTC"
    });

    await withAuth(request(app).delete("/api/currencies/BTC")).expect(204);

    const response = await withAuth(
      request(app).get("/api/currencies/BTC")
    ).expect(404);

    expect(response.body.error).toBe("Currency not found");
  });
});
