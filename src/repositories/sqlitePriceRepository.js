const mapDatabaseError = require("../database/databaseErrorMapper");
const runInTransaction = require("../database/transaction");

class SQLitePriceRepository {
  constructor(dependencies = {}) {
    const {
      db,
      transactionRunner = runInTransaction,
      errorMapper = mapDatabaseError,
    } = dependencies;

    if (!db) {
      throw new Error("Database connection is required");
    }

    this.db = db;
    this.transactionRunner = transactionRunner;
    this.errorMapper = errorMapper;
  }

  async findByCurrencyTicker(ticker) {
    const normalizedTicker = this.normalizeTicker(ticker);

    return this.execute(
      "findByCurrencyTicker",
      async () => {
        return this.db.all(
          `
          SELECT symbol, price
          FROM prices
          WHERE currency_ticker = ?
          ORDER BY symbol ASC
          `,
          [normalizedTicker]
        );
      },
      {
        ticker: normalizedTicker,
      }
    );
  }

  async replaceForCurrencyTicker(ticker, prices) {
    const normalizedTicker = this.normalizeTicker(ticker);
    const updatedAt = new Date().toISOString();

    return this.execute(
      "replaceForCurrencyTicker",
      async () => {
        return this.transactionRunner(this.db, async () => {
          await this.db.run(
            `
            DELETE FROM prices
            WHERE currency_ticker = ?
            `,
            [normalizedTicker]
          );

          for (const item of prices) {
            await this.db.run(
              `
              INSERT INTO prices (currency_ticker, symbol, price, updated_at)
              VALUES (?, ?, ?, ?)
              `,
              [
                normalizedTicker,
                this.normalizeSymbol(item.symbol),
                String(item.price),
                updatedAt,
              ]
            );
          }

          return {
            currency: normalizedTicker,
            pricesCount: prices.length,
            updatedAt,
          };
        });
      },
      {
        ticker: normalizedTicker,
        pricesCount: prices.length,
      }
    );
  }

  normalizeTicker(ticker) {
    return String(ticker).trim().toUpperCase();
  }

  normalizeSymbol(symbol) {
    return String(symbol).trim().toUpperCase();
  }

  async execute(operation, action, context = {}) {
    try {
      return await action();
    } catch (error) {
      throw this.errorMapper(error, {
        operation,
        ...context,
      });
    }
  }
}

module.exports = SQLitePriceRepository;
