const { randomUUID } = require("crypto");

function createRequestIdMiddleware() {
  return function requestIdMiddleware(req, res, next) {
    const requestId = req.headers["x-request-id"] || randomUUID();

    req.requestId = requestId;
    res.set("X-Request-Id", requestId);

    return next();
  };
}

module.exports = createRequestIdMiddleware;
