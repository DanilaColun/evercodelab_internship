const AppError = require("../../src/errors/AppError");
const ValidationError = require("../../src/errors/ValidationError");
const ConfigError = require("../../src/errors/ConfigError");
const SchedulerError = require("../../src/errors/SchedulerError");

describe("custom errors", () => {
  test("app error saves useful error info", () => {
    const error = new AppError("app crashed", {
      statusCode: 500,
      requestId: "req-1",
      context: {
        module: "test"
      }
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("AppError");
    expect(error.message).toBe("app crashed");
    expect(error.statusCode).toBe(500);
    expect(error.requestId).toBe("req-1");
    expect(error.context).toEqual({
      module: "test"
    });
    expect(typeof error.timestamp).toBe("string");
  });

  test("validation error is used for bad input", () => {
    const error = new ValidationError("task name needed", {
      context: {
        field: "name"
      }
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("task name needed");
    expect(error.statusCode).toBe(400);
    expect(error.context.field).toBe("name");
    expect(typeof error.timestamp).toBe("string");
  });

  test("config error is used when config is wrong", () => {
    const error = new ConfigError("app name needed", {
      context: {
        field: "appName"
      }
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("ConfigError");
    expect(error.message).toBe("app name needed");
    expect(error.statusCode).toBe(500);
    expect(error.context.field).toBe("appName");
    expect(typeof error.timestamp).toBe("string");
  });

  test("scheduler error is used when scheduler breaks", () => {
    const error = new SchedulerError("scheduler crashed", {
      context: {
        taskName: "background task"
      }
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("SchedulerError");
    expect(error.message).toBe("scheduler crashed");
    expect(error.statusCode).toBe(500);
    expect(error.context.taskName).toBe("background task");
    expect(typeof error.timestamp).toBe("string");
  });
});