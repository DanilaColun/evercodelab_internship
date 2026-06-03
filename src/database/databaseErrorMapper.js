const AppError = require("../errors/AppError");
const ConflictError = require("../errors/ConflictError");
const DatabaseError = require("../errors/DatabaseError");

function isSqliteConstraintError(error) {
  return (
    error &&
    (
      error.code === "SQLITE_CONSTRAINT" ||
      String(error.message).includes("SQLITE_CONSTRAINT") ||
      String(error.message).includes("UNIQUE constraint failed")
    )
  );
}

function mapDatabaseError(error, context = {}) {
  if (error instanceof AppError) {
    return error;
  }

  if (isSqliteConstraintError(error) && context.operation === "create") {
    return new ConflictError("Currency already exists", {
      context: {
        ticker: context.ticker
      }
    });
  }

  return new DatabaseError("Database operation failed", {
    context: {
      ...context,
      originalMessage: error.message
    }
  });
}

module.exports = mapDatabaseError;
