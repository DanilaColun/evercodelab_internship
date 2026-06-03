const request = require("supertest");

const createTestApp = require("../../../testUtils/createTestApp");

describe("openApiRoutes", () => {
  let testDatabase;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(async () => {
    if (testDatabase) {
      await testDatabase.close();
      testDatabase = null;
    }

    jest.restoreAllMocks();
  });

  async function buildApp() {
    const testApp = await createTestApp();

    testDatabase = testApp.testDatabase;

    return testApp.app;
  }

  test("returns OpenAPI specification", async () => {
    const app = await buildApp();

    const response = await request(app).get("/openapi.json").expect(200);

    expect(response.body.openapi).toBe("3.0.0");
    expect(response.body.info.title).toBe("Evercodelab API");

    expect(response.body.paths["/status"]).toBeDefined();
    expect(response.body.paths["/openapi.json"]).toBeDefined();
    expect(response.body.paths["/api/currencies"]).toBeDefined();
    expect(response.body.paths["/api/currencies/{ticker}"]).toBeDefined();
    expect(response.body.paths["/price"]).toBeDefined();

    expect(response.body.components.schemas.Price).toBeDefined();
    expect(response.body.components.schemas.PriceResponse).toBeDefined();
    expect(response.body.components.responses.ExternalApiError).toBeDefined();

    expect(response.body.components.schemas.Currency).toBeDefined();
    expect(response.body.components.securitySchemes.bearerAuth).toBeDefined();
  });

  test("does not require token for OpenAPI file", async () => {
    const app = await buildApp();

    await request(app).get("/openapi.json").expect(200);
  });
});
