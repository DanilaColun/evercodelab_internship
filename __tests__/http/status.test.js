const request = require("supertest");
const createApp = require("../../src/http/createApp");

describe("GET /status", () => {
  test("returns ok", async () => {
    const app = createApp();

    await request(app)
      .get("/status")
      .expect(200)
      .expect("ok");
  });
});
