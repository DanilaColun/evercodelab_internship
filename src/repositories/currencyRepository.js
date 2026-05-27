class CurrencyRepository {
  constructor(currencies = []) {
    this.currencies = currencies.map((currency) => ({ ...currency }));
  }

  findAll() {
    return this.currencies.map((currency) => ({ ...currency }));
  }

  findByTicker(ticker) {
    const normalizedTicker = this.normalizeTicker(ticker);

    const currency = this.currencies.find(
      (item) => item.ticker === normalizedTicker
    );

    if (!currency) {
      return null;
    }

    return { ...currency };
  }

  create(currency) {
    const newCurrency = {
      name: currency.name,
      ticker: this.normalizeTicker(currency.ticker),
    };

    this.currencies.push(newCurrency);

    return { ...newCurrency };
  }

  update(ticker, currency) {
    const normalizedTicker = this.normalizeTicker(ticker);

    const currencyIndex = this.currencies.findIndex(
      (item) => item.ticker === normalizedTicker
    );

    if (currencyIndex === -1) {
      return null;
    }

    const updatedCurrency = {
      name: currency.name,
      ticker: normalizedTicker,
    };

    this.currencies[currencyIndex] = updatedCurrency;

    return { ...updatedCurrency };
  }

  delete(ticker) {
    const normalizedTicker = this.normalizeTicker(ticker);

    const currencyIndex = this.currencies.findIndex(
      (item) => item.ticker === normalizedTicker
    );

    if (currencyIndex === -1) {
      return false;
    }

    this.currencies.splice(currencyIndex, 1);

    return true;
  }

  exists(ticker) {
    return this.findByTicker(ticker) !== null;
  }

  normalizeTicker(ticker) {
    return String(ticker).trim().toUpperCase();
  }
}

module.exports = CurrencyRepository;
