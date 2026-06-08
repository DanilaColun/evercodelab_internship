const express = require("express");

const ConfigError = require("../../errors/ConfigError");
const { validatePriceQuery } = require("../../validators/priceValidator");

function createPriceRoutes(dependencies = {}) {
  const { priceService } = dependencies;

  if (!priceService) {
    throw new ConfigError("Price service is required", {
      context: {
        dependency: "priceService",
      },
    });
  }

  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const { currency } = validatePriceQuery(req.query, {
        requestId: req.requestId,
      });

      const result = await priceService.getPricesByCurrency(currency, {
        requestId: req.requestId,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = createPriceRoutes;
