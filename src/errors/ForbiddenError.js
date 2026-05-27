const AppError = require("./AppError");

class ForbiddenError extends AppError {
  constructor(message = "Forbidden", options = {}) {
    super(message, {
      statusCode: 403,
      requestId: options.requestId,
      context: options.context
    });
  }
}

module.exports = ForbiddenError;
