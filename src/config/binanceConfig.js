const binanceConfig = {
  baseUrl: "https://data-api.binance.vision",
  pricesPath: "/api/v3/ticker/price",
  timeoutMs: 5000,
  retryCount: 2,
  retryDelayMs: 300
};

module.exports = binanceConfig;
