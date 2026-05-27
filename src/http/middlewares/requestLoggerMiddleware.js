function createRequestLoggerMiddleware(dependencies = {}) {
  const { logger } = dependencies;

  return function requestLoggerMiddleware(req, res, next) {
    const requestId = req.requestId;
    const startedAt = Date.now();

    if (logger && typeof logger.info === "function") {
      logger.info(`request started ${req.method} ${req.originalUrl}`, {
        requestId
      });
    }

    res.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      const message = `request finished ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`;

      if (!logger) {
        return;
      }

      if (res.statusCode >= 500 && typeof logger.error === "function") {
        logger.error(message, { requestId });
        return;
      }

      if (res.statusCode >= 400 && typeof logger.warn === "function") {
        logger.warn(message, { requestId });
        return;
      }

      if (typeof logger.info === "function") {
        logger.info(message, { requestId });
      }
    });

    return next();
  };
}

module.exports = createRequestLoggerMiddleware;
