const ConflictError = require("../../src/errors/ConflictError");
const DatabaseError = require("../../src/errors/DatabaseError");
const NotFoundError = require("../../src/errors/NotFoundError");
const mapDatabaseError = require("../../src/database/databaseErrorMapper");

describe("mapDatabaseError", () => {
  test("returns ConflictError when currency already exists", () => {
    const sqliteError = new Error(
      "SQLITE_CONSTRAINT: UNIQUE constraint failed: currencies.ticker"
    );

    sqliteError.code = "SQLITE_CONSTRAINT";

    const error = mapDatabaseError(sqliteError, {
      operation: "create",
      ticker: "BTC"
    });

    expect(error).toBeInstanceOf(ConflictError);
    expect(error.message).toBe("Currency already exists");
    expect(error.statusCode).toBe(409);
    expect(error.context.ticker).toBe("BTC");
  });

  test("returns DatabaseError for unknown database error", () => {
    const sqliteError = new Error("database is locked");

    const error = mapDatabaseError(sqliteError, {
      operation: "update",
      ticker: "BTC"
    });

    expect(error).toBeInstanceOf(DatabaseError);
    expect(error.message).toBe("Database operation failed");
    expect(error.statusCode).toBe(500);
    expect(error.context.operation).toBe("update");
    expect(error.context.ticker).toBe("BTC");
    expect(error.context.originalMessage).toBe("database is locked");
  });

  test("keeps AppError as it is", () => {
    const appError = new NotFoundError("Currency not found", {
      context: {
        ticker: "BTC"
      }
    });

    const error = mapDatabaseError(appError, {
      operation: "findByTicker"
    });

    expect(error).toBe(appError);
  });
});
