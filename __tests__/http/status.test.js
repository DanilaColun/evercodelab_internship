const request = require("supertest");

const createTestApp = require("../../testUtils/createTestApp");

describe("status route", () => {
  let testDatabase;

  afterEach(async () => {
    if (testDatabase) {
      await testDatabase.close();
      testDatabase = null;
    }
  });

  test("returns ok", async () => {
    const testApp = await createTestApp();
    const app = testApp.app;
    testDatabase = testApp.testDatabase;

    await request(app).get("/status").expect(200).expect("ok");
  });
});
