const AppError = require("./AppError");

class ConflictError extends AppError {
  constructor(message = "Conflict", options = {}) {
    super(message, {
      statusCode: 409,
      requestId: options.requestId,
      context: options.context
    });
  }
}

module.exports = ConflictError;
