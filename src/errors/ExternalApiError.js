const AppError = require("./AppError");

class ExternalApiError extends AppError {
  constructor(message = "External API error", options = {}) {
    super(message, {
      statusCode: options.statusCode || 502,
      requestId: options.requestId,
      context: options.context
    });
  }
}

module.exports = ExternalApiError;
