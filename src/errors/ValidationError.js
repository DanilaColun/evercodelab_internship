const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      statusCode: 400,
      requestId: options.requestId,
      context: options.context
    });
  }
}

module.exports = ValidationError;