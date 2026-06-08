const SchedulerError = require("../../src/errors/SchedulerError");
const startScheduler = require("../../src/scheduler/startScheduler");

function createLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

describe("startScheduler", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("starts price update task immediately", async () => {
    const logger = createLogger();

    const priceUpdateService = {
      updateAllPrices: jest.fn().mockResolvedValue({
        updatedCurrencies: 1,
        updatedPrices: 2,
        durationMs: 5,
      }),
    };

    const scheduler = startScheduler({
      logger,
      priceUpdateService,
      intervalMs: 1000,
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(priceUpdateService.updateAllPrices).toHaveBeenCalledTimes(1);

    expect(logger.info).toHaveBeenCalledWith("scheduler started", {
      requestId: "scheduler-task",
    });

    await scheduler.stop();
  });

  test("logs scheduler error if price update fails", async () => {
    const logger = createLogger();

    const priceUpdateService = {
      updateAllPrices: jest.fn().mockRejectedValue(new Error("Binance failed")),
    };

    const scheduler = startScheduler({
      logger,
      priceUpdateService,
      intervalMs: 1000,
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(logger.error).toHaveBeenCalled();

    await scheduler.stop();
  });

  test("throws scheduler error if logger is missing", () => {
    expect(() => {
      startScheduler({
        priceUpdateService: {
          updateAllPrices: jest.fn(),
        },
      });
    }).toThrow(SchedulerError);
  });

  test("throws scheduler error if price update service is missing", () => {
    const logger = createLogger();

    expect(() => {
      startScheduler({
        logger,
      });
    }).toThrow(SchedulerError);
  });
});
