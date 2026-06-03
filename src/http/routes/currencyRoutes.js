const express = require("express");

const ConflictError = require("../../errors/ConflictError");
const NotFoundError = require("../../errors/NotFoundError");
const ValidationError = require("../../errors/ValidationError");
const {
  normalizeTicker,
  validateCurrencyPayload,
} = require("../../validators/currencyValidator");

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function createCurrencyRoutes(dependencies = {}) {
  const { currencyRepository } = dependencies;

  if (!currencyRepository) {
    throw new Error("Currency repository is required");
  }

  const router = express.Router();

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const currencies = await currencyRepository.findAll();

      return res.status(200).json(currencies);
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const currencyData = validateCurrencyPayload(req.body, {
        requestId: req.requestId,
      });

      const currencyExists = await currencyRepository.exists(
        currencyData.ticker
      );

      if (currencyExists) {
        throw new ConflictError("Currency already exists", {
          requestId: req.requestId,
          context: {
            ticker: currencyData.ticker,
          },
        });
      }

      const currency = await currencyRepository.create(currencyData);

      return res.status(201).json(currency);
    })
  );

  router.get(
    "/:ticker",
    asyncHandler(async (req, res) => {
      const ticker = normalizeTicker(req.params.ticker);
      const currency = await currencyRepository.findByTicker(ticker);

      if (!currency) {
        throw new NotFoundError("Currency not found", {
          requestId: req.requestId,
          context: {
            ticker,
          },
        });
      }

      return res.status(200).json(currency);
    })
  );

  router.put(
    "/:ticker",
    asyncHandler(async (req, res) => {
      const ticker = normalizeTicker(req.params.ticker);
      const currencyData = validateCurrencyPayload(req.body, {
        requestId: req.requestId,
      });

      if (currencyData.ticker !== ticker) {
        throw new ValidationError("Ticker must match URL", {
          requestId: req.requestId,
          context: {
            urlTicker: ticker,
            bodyTicker: currencyData.ticker,
          },
        });
      }

      const updatedCurrency = await currencyRepository.update(
        ticker,
        currencyData
      );

      if (!updatedCurrency) {
        throw new NotFoundError("Currency not found", {
          requestId: req.requestId,
          context: {
            ticker,
          },
        });
      }

      return res.status(200).json(updatedCurrency);
    })
  );

  router.delete(
    "/:ticker",
    asyncHandler(async (req, res) => {
      const ticker = normalizeTicker(req.params.ticker);
      const isDeleted = await currencyRepository.delete(ticker);

      if (!isDeleted) {
        throw new NotFoundError("Currency not found", {
          requestId: req.requestId,
          context: {
            ticker,
          },
        });
      }

      return res.status(204).send();
    })
  );

  return router;
}

module.exports = createCurrencyRoutes;
