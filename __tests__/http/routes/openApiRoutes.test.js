const request = require("supertest");
const createApp = require("../../../src/http/createApp");

describe("openApiRoutes", () => {
  test("returns OpenAPI specification", async () => {
    const app = createApp();

    const response = await request(app).get("/openapi.json").expect(200);

    expect(response.body.openapi).toBe("3.0.0");
    expect(response.body.info.title).toBe("Evercodelab API");

    expect(response.body.paths["/status"]).toBeDefined();
    expect(response.body.paths["/openapi.json"]).toBeDefined();
    expect(response.body.paths["/api/currencies"]).toBeDefined();
    expect(response.body.paths["/api/currencies/{ticker}"]).toBeDefined();

    expect(response.body.components.schemas.Currency).toBeDefined();
    expect(response.body.components.securitySchemes.bearerAuth).toBeDefined();
  });

  test("does not require token for OpenAPI file", async () => {
    const app = createApp();

    await request(app).get("/openapi.json").expect(200);
  });
});
