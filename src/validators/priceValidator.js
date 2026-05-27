const ValidationError = require("../errors/ValidationError");

function validatePriceQuery(query = {}, options = {}) {
  const currency =
    typeof query.currency === "string" ? query.currency.trim().toUpperCase() : "";

  if (!currency) {
    throw new ValidationError("Currency is required", {
      requestId: options.requestId,
      context: {
        details: ["Currency is required"]
      }
    });
  }

  return {
    currency
  };
}

module.exports = {
  validatePriceQuery
};
