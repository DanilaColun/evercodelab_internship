const validateTaskOptions = require("../../src/validators/taskValidator");
const ValidationError = require("../../src/errors/ValidationError");

describe("task validator", () => {
  test("valid task works fine", () => {
    expect(() => {
      validateTaskOptions("background task", 1000, function () {});
    }).not.toThrow();
  });

  test("throws validation error when task name needed", () => {
    let error;

    try {
      validateTaskOptions("", 1000, function () {});
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe("ValidationError");
    expect(error.statusCode).toBe(400);
    expect(error.context.field).toBe("name");
  });

  test("throws validation error when interval is wrong", () => {
    let error;

    try {
      validateTaskOptions("background task", 0, function () {});
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe("ValidationError");
    expect(error.statusCode).toBe(400);
    expect(error.context.field).toBe("interval");
  });

  test("throws validation error when task callback is wrong", () => {
    let error;

    try {
      validateTaskOptions("background task", 1000, "not a function");
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe("ValidationError");
    expect(error.statusCode).toBe(400);
    expect(error.context.field).toBe("task");
    expect(error.context.valueType).toBe("string");
  });
});