const runInTransaction = require("../../src/database/transaction");

describe("runInTransaction", () => {
  test("commits transaction when action succeed", async () => {
    const db = {
      exec: jest.fn().mockResolvedValue()
    };

    const action = jest.fn().mockResolvedValue("done");

    const result = await runInTransaction(db, action);

    expect(result).toBe("done");
    expect(db.exec).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(db.exec).toHaveBeenNthCalledWith(2, "COMMIT");
    expect(db.exec).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenCalledTimes(1);
  });

  test("rolls back transaction when action fail", async () => {
    const db = {
      exec: jest.fn().mockResolvedValue()
    };

    const error = new Error("insert failed");
    const action = jest.fn().mockRejectedValue(error);

    await expect(runInTransaction(db, action)).rejects.toThrow("insert failed");

    expect(db.exec).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(db.exec).toHaveBeenNthCalledWith(2, "ROLLBACK");
    expect(db.exec).toHaveBeenCalledTimes(2);
  });

  test("requires database connection", async () => {
    await expect(
      runInTransaction(null, jest.fn())
    ).rejects.toThrow("Database connection is needed");
  });
});
