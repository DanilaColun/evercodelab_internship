const express = require("express");
const ConflictError = require("../../errors/ConflictError");
const NotFoundError = require("../../errors/NotFoundError");
const ValidationError = require("../../errors/ValidationError");
const {
  normalizeTicker,
  validateCurrencyPayload
} = require("../../validators/currencyValidator");

function createCurrencyRoutes(dependencies = {}) {
  const { currencyRepository } = dependencies;

  if (!currencyRepository) {
    throw new Error("Currency repository is required");
  }

  const router = express.Router();

  router.get("/", (req, res) => {
    const currencies = currencyRepository.findAll();

    return res.status(200).json(currencies);
  });

  router.post("/", (req, res) => {
    const currencyData = validateCurrencyPayload(req.body, {
      requestId: req.requestId
    });

    if (currencyRepository.exists(currencyData.ticker)) {
      throw new ConflictError("Currency already exists", {
        requestId: req.requestId,
        context: {
          ticker: currencyData.ticker
        }
      });
    }

    const currency = currencyRepository.create(currencyData);

    return res.status(201).json(currency);
  });

  router.get("/:ticker", (req, res) => {
    const ticker = normalizeTicker(req.params.ticker);
    const currency = currencyRepository.findByTicker(ticker);

    if (!currency) {
      throw new NotFoundError("Currency not found", {
        requestId: req.requestId,
        context: {
          ticker
        }
      });
    }

    return res.status(200).json(currency);
  });

  router.put("/:ticker", (req, res) => {
    const ticker = normalizeTicker(req.params.ticker);
    const currencyData = validateCurrencyPayload(req.body, {
      requestId: req.requestId
    });

    if (currencyData.ticker !== ticker) {
      throw new ValidationError("Ticker must match URL", {
        requestId: req.requestId,
        context: {
          urlTicker: ticker,
          bodyTicker: currencyData.ticker
        }
      });
    }

    const updatedCurrency = currencyRepository.update(ticker, currencyData);

    if (!updatedCurrency) {
      throw new NotFoundError("Currency not found", {
        requestId: req.requestId,
        context: {
          ticker
        }
      });
    }

    return res.status(200).json(updatedCurrency);
  });

  router.delete("/:ticker", (req, res) => {
    const ticker = normalizeTicker(req.params.ticker);
    const isDeleted = currencyRepository.delete(ticker);

    if (!isDeleted) {
      throw new NotFoundError("Currency not found", {
        requestId: req.requestId,
        context: {
          ticker
        }
      });
    }

    return res.status(204).send();
  });

  return router;
}

module.exports = createCurrencyRoutes;
