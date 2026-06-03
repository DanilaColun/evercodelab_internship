const NotFoundError = require("../errors/NotFoundError");

class PriceService {
  constructor(dependencies = {}) {
    const { currencyRepository, binanceService } = dependencies;

    if (!currencyRepository) {
      throw new Error("Currency repository is required");
    }

    if (!binanceService) {
      throw new Error("Binance service is required");
    }

    this.currencyRepository = currencyRepository;
    this.binanceService = binanceService;
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
          currency: normalizedCurrency
        }
      });
    }

    const prices = await this.binanceService.getAllPrices({
      requestId: options.requestId
    });

    const filteredPrices = prices.filter((price) => {
      return price.symbol.includes(normalizedCurrency);
    });

    return {
      currency: normalizedCurrency,
      prices: filteredPrices
    };
  }

  normalizeCurrency(currency) {
    return String(currency).trim().toUpperCase();
  }
}

module.exports = PriceService;
