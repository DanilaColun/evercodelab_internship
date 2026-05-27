const AppError = require("./AppError");

class NotFoundError extends AppError {
  constructor(message = "Not found", options = {}) {
    super(message, {
      statusCode: 404,
      requestId: options.requestId,
      context: options.context
    });
  }
}

module.exports = NotFoundError;