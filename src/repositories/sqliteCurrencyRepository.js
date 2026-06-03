const DatabaseError = require("../errors/DatabaseError");

class SQLiteCurrencyRepository {
  constructor(dependencies = {}) {
    const { db } = dependencies;

    if (!db) {
      throw new Error("Database connection is required");
    }

    this.db = db;
  }

  async findAll() {
    return this.execute("findAll", async () => {
      return this.db.all(
        "SELECT name, ticker FROM currencies ORDER BY ticker ASC"
      );
    });
  }

  async findByTicker(ticker) {
    const normalizedTicker = this.normalizeTicker(ticker);

    return this.execute(
      "findByTicker",
      async () => {
        const currency = await this.db.get(
          "SELECT name, ticker FROM currencies WHERE ticker = ?",
          [normalizedTicker]
        );

        return currency || null;
      },
      {
        ticker: normalizedTicker,
      }
    );
  }

  async create(currency) {
    const newCurrency = {
      name: currency.name,
      ticker: this.normalizeTicker(currency.ticker),
    };

    return this.execute(
      "create",
      async () => {
        await this.db.run(
          "INSERT INTO currencies (name, ticker) VALUES (?, ?)",
          [newCurrency.name, newCurrency.ticker]
        );

        return { ...newCurrency };
      },
      {
        ticker: newCurrency.ticker,
      }
    );
  }

  async update(ticker, currency) {
    const normalizedTicker = this.normalizeTicker(ticker);

    return this.execute(
      "update",
      async () => {
        const result = await this.db.run(
          "UPDATE currencies SET name = ? WHERE ticker = ?",
          [currency.name, normalizedTicker]
        );

        if (result.changes === 0) {
          return null;
        }

        return {
          name: currency.name,
          ticker: normalizedTicker,
        };
      },
      {
        ticker: normalizedTicker,
      }
    );
  }

  async delete(ticker) {
    const normalizedTicker = this.normalizeTicker(ticker);

    return this.execute(
      "delete",
      async () => {
        const result = await this.db.run(
          "DELETE FROM currencies WHERE ticker = ?",
          [normalizedTicker]
        );

        return result.changes > 0;
      },
      {
        ticker: normalizedTicker,
      }
    );
  }

  async exists(ticker) {
    const normalizedTicker = this.normalizeTicker(ticker);

    return this.execute(
      "exists",
      async () => {
        const result = await this.db.get(
          "SELECT 1 AS found FROM currencies WHERE ticker = ? LIMIT 1",
          [normalizedTicker]
        );

        return Boolean(result);
      },
      {
        ticker: normalizedTicker,
      }
    );
  }

  normalizeTicker(ticker) {
    return String(ticker).trim().toUpperCase();
  }

  async execute(operation, action, context = {}) {
    try {
      return await action();
    } catch (error) {
      throw new DatabaseError("Database operation failed", {
        context: {
          operation,
          ...context,
          originalMessage: error.message,
        },
      });
    }
  }
}

module.exports = SQLiteCurrencyRepository;
