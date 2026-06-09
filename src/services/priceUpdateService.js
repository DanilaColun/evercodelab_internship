const ConfigError = require("../errors/ConfigError");

class PriceUpdateService {
  constructor(dependencies = {}) {
    const {
      currencyRepository,
      priceRepository,
      binanceService,
      logger,
    } = dependencies;

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

    if (!binanceService) {
      throw new ConfigError("Binance service is required", {
        context: {
          dependency: "binanceService",
        },
      });
    }

    this.currencyRepository = currencyRepository;
    this.priceRepository = priceRepository;
    this.binanceService = binanceService;
    this.logger = logger;
  }

  async updateAllPrices(options = {}) {
    const requestId = options.requestId || "price-update-task";
    const startedAt = Date.now();

    const currencies = await this.currencyRepository.findAll();

    if (currencies.length === 0) {
      this.logInfo("price update skipped: no currencies", {
        requestId,
      });

      return {
        updatedCurrencies: 0,
        updatedPrices: 0,
        durationMs: Date.now() - startedAt,
      };
    }

    const allPrices = await this.binanceService.getAllPrices({
      requestId,
    });

    let updatedPrices = 0;

    for (const currency of currencies) {
      const pricesForCurrency = this.filterPricesByTicker(
        allPrices,
        currency.ticker
      );

      await this.priceRepository.replaceForCurrencyTicker(
        currency.ticker,
        pricesForCurrency
      );

      updatedPrices += pricesForCurrency.length;
    }

    const result = {
      updatedCurrencies: currencies.length,
      updatedPrices,
      durationMs: Date.now() - startedAt,
    };

    this.logInfo(
      `price update done: currencies=${result.updatedCurrencies}, prices=${result.updatedPrices}, durationMs=${result.durationMs}`,
      {
        requestId,
      }
    );

    return result;
  }

  filterPricesByTicker(prices, ticker) {
    const normalizedTicker = String(ticker).trim().toUpperCase();

    return prices.filter((price) => {
      return String(price.symbol).toUpperCase().includes(normalizedTicker);
    });
  }

  logInfo(message, options = {}) {
    if (this.logger && typeof this.logger.info === "function") {
      this.logger.info(message, options);
    }
  }
}

module.exports = PriceUpdateService;
