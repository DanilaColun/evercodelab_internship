const ConfigError = require("../errors/ConfigError");
const NotFoundError = require("../errors/NotFoundError");

class PriceService {
  constructor(dependencies = {}) {
    const { currencyRepository, priceRepository } = dependencies;

    if (!currencyRepository) {
      throw new ConfigError("Currency repository is required", {
        context: {
          dependency: "currencyRepository",
        },
      });
    }

    if (!priceRepository) {
      throw new ConfigError("Price repository is required", {
        context: {
          dependency: "priceRepository",
        },
      });
    }

    this.currencyRepository = currencyRepository;
    this.priceRepository = priceRepository;
  }

  async getPricesByCurrency(currency, options = {}) {
    const normalizedCurrency = this.normalizeCurrency(currency);

    const currencyFromDb = await this.currencyRepository.findByTicker(
      normalizedCurrency
    );

    if (!currencyFromDb) {
      throw new NotFoundError("Currency not found", {
        requestId: options.requestId,
        context: {
          currency: normalizedCurrency,
        },
      });
    }

    const prices = await this.priceRepository.findByCurrencyTicker(
      normalizedCurrency
    );

    return {
      currency: normalizedCurrency,
      prices,
    };
  }

  normalizeCurrency(currency) {
    return String(currency).trim().toUpperCase();
  }
}

module.exports = PriceService;
