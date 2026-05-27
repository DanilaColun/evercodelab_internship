const AppError = require("../../errors/AppError");

function createErrorMiddleware(dependencies = {}) {
  const { logger } = dependencies;

  return function errorMiddleware(error, req, res, next) {
    const isAppError = error instanceof AppError;
    const statusCode = isAppError ? error.statusCode : 500;
    const message = isAppError ? error.message : "Internal server error";
    const requestId = error.requestId || req.requestId || null;

    if (logger) {
      const logData = {
        requestId,
        context: {
          statusCode,
          method: req.method,
          path: req.originalUrl,
          errorName: error.name,
          errorContext: error.context || null
        }
      };

      if (statusCode >= 500 && typeof logger.error === "function") {
        logger.error(message, logData);
      } else if (typeof logger.warn === "function") {
        logger.warn(message, logData);
      }
    }

    const responseBody = {
      error: message
    };

    if (requestId) {
      responseBody.requestId = requestId;
    }

    if (Array.isArray(error.context?.details)) {
      responseBody.details = error.context.details;
    }

    return res.status(statusCode).json(responseBody);
  };
}

module.exports = createErrorMiddleware;
