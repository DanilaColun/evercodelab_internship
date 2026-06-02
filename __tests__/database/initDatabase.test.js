const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const DatabaseError = require("../../src/errors/DatabaseError");
const initDatabase = require("../../src/database/initDatabase");

describe("initDatabase", () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("creates SQLite database file and currencies table", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "evercodelab-db-"));
    const databaseFile = path.join(tempDir, "test.sqlite");

    await initDatabase({
      filename: databaseFile,
    });

    const db = await open({
      filename: databaseFile,
      driver: sqlite3.Database,
    });

    const table = await db.get(
      "SELECT name FROM sqlite_master WHERE type = ? AND name = ?",
      ["table", "currencies"]
    );

    await db.close();

    expect(table).toEqual({
      name: "currencies",
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  test("throws DatabaseError when schema file is missing", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "evercodelab-db-"));
    const databaseFile = path.join(tempDir, "test.sqlite");
    const missingSchemaPath = path.join(tempDir, "missing-schema.sql");

    await expect(
      initDatabase({
        filename: databaseFile,
        schemaPath: missingSchemaPath,
      })
    ).rejects.toBeInstanceOf(DatabaseError);

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
