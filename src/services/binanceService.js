const ExternalApiError = require("../errors/ExternalApiError");
const binanceConfig = require("../config/binanceConfig");
const { requestJson } = require("../clients/httpJsonClient");

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class BinanceService {
  constructor(dependencies = {}) {
    this.baseUrl = dependencies.baseUrl || binanceConfig.baseUrl;
    this.pricesPath = dependencies.pricesPath || binanceConfig.pricesPath;
    this.timeoutMs = dependencies.timeoutMs || binanceConfig.timeoutMs;
    this.retryCount =
      dependencies.retryCount !== undefined
        ? dependencies.retryCount
        : binanceConfig.retryCount;
    this.retryDelayMs =
      dependencies.retryDelayMs !== undefined
        ? dependencies.retryDelayMs
        : binanceConfig.retryDelayMs;

    this.httpClient = dependencies.httpClient || requestJson;
    this.logger = dependencies.logger;
  }

  async getAllPrices(options = {}) {
    const requestId = options.requestId;
    const url = `${this.baseUrl}${this.pricesPath}`;

    let lastError = null;

    for (let attempt = 1; attempt <= this.retryCount + 1; attempt += 1) {
      try {
        const response = await this.httpClient(url, {
          timeoutMs: this.timeoutMs
        });

        if (response.statusCode < 200 || response.statusCode >= 300) {
          throw new ExternalApiError("Binance returned bad status", {
            requestId,
            context: {
              statusCode: response.statusCode,
              attempt
            }
          });
        }

        if (!Array.isArray(response.body)) {
          throw new ExternalApiError("Binance returned invalid data", {
            requestId,
            context: {
              attempt
            }
          });
        }

        return this.normalizePrices(response.body, {
          requestId
        });
      } catch (error) {
        lastError = error;

        if (this.logger && typeof this.logger.warn === "function") {
          this.logger.warn("Binance request failed", {
            requestId,
            context: {
              attempt,
              message: error.message
            }
          });
        }

        if (attempt <= this.retryCount) {
          await wait(this.retryDelayMs);
        }
      }
    }

    if (lastError instanceof ExternalApiError) {
      throw lastError;
    }

    throw new ExternalApiError("Binance is not available", {
      requestId,
      context: {
        reason: lastError ? lastError.message : "Unknown error"
      }
    });
  }

  normalizePrices(prices, options = {}) {
    const normalizedPrices = prices
      .filter((item) => {
        return (
          item &&
          typeof item.symbol === "string" &&
          typeof item.price === "string"
        );
      })
      .map((item) => {
        return {
          symbol: item.symbol,
          price: item.price
        };
      });

    if (normalizedPrices.length === 0) {
      throw new ExternalApiError("Binance returned empty prices", {
        requestId: options.requestId
      });
    }

    return normalizedPrices;
  }
}

module.exports = BinanceService;
