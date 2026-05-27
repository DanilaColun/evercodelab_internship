const ForbiddenError = require("../../errors/ForbiddenError");

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function createAuthMiddleware(dependencies = {}) {
  const { apiToken } = dependencies;

  return function authMiddleware(req, res, next) {
    const token = extractBearerToken(req.headers.authorization);

    if (!apiToken || token !== apiToken) {
      return next(
        new ForbiddenError("Forbidden", {
          requestId: req.requestId,
          context: {
            path: req.originalUrl
          }
        })
      );
    }

    return next();
  };
}

module.exports = createAuthMiddleware;
module.exports.extractBearerToken = extractBearerToken;
