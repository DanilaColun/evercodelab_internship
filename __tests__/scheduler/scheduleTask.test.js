const scheduleTask = require("../../src/scheduler/scheduleTask");
const SchedulerError = require("../../src/errors/SchedulerError");

describe("schedule task", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("handles null task error without crashing", async () => {
    const onError = jest.fn();

    const intervalId = scheduleTask(
      "broken task",
      1000,
      async function () {
        throw null;
      },
      {
        onError
      }
    );

    jest.advanceTimersByTime(1000);
    await Promise.resolve();

    clearInterval(intervalId);

    expect(onError).toHaveBeenCalledTimes(1);

    const error = onError.mock.calls[0][0];

    expect(error).toBeInstanceOf(SchedulerError);
    expect(error.context.taskName).toBe("broken task");
    expect(error.context.originalErrorMessage).toBe("null");
  });

  test("handles normal error message", async () => {
    const onError = jest.fn();

    const intervalId = scheduleTask(
      "broken task",
      1000,
      async function () {
        throw new Error("task failed");
      },
      {
        onError
      }
    );

    jest.advanceTimersByTime(1000);
    await Promise.resolve();

    clearInterval(intervalId);

    const error = onError.mock.calls[0][0];

    expect(error).toBeInstanceOf(SchedulerError);
    expect(error.context.originalErrorMessage).toBe("task failed");
  });
});
