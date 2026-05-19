const AppError = require("./AppError");

class SchedulerError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      statusCode: 500,
      requestId: options.requestId,
      context: options.context
    });
  }
}

module.exports = SchedulerError;