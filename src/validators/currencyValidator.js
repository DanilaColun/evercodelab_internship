const ValidationError = require("../errors/ValidationError");

function normalizeTicker(ticker) {
  return String(ticker).trim().toUpperCase();
}

function validateCurrencyPayload(payload = {}, options = {}) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const ticker =
    typeof payload.ticker === "string" ? normalizeTicker(payload.ticker) : "";

  const details = [];

  if (!name) {
    details.push("Name is required");
  }

  if (!ticker) {
    details.push("Ticker is required");
  }

  if (details.length > 0) {
    throw new ValidationError("Invalid currency data", {
      requestId: options.requestId,
      context: {
        details
      }
    });
  }

  return {
    name,
    ticker
  };
}

module.exports = {
  normalizeTicker,
  validateCurrencyPayload
};
