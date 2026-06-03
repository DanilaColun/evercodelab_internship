const request = require("supertest");

const createTestApp = require("../../testUtils/createTestApp");

describe("status route", () => {
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

  test("returns ok", async () => {
    const testApp = await createTestApp();
    const app = testApp.app;
    testDatabase = testApp.testDatabase;

    await request(app).get("/status").expect(200).expect("ok");
  });
});
