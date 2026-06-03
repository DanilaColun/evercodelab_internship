async function runInTransaction(db, action) {
  if (!db) {
    throw new Error("Database connection is needed");
  }

  let transactionStarted = false;

  try {
    await db.exec("BEGIN");
    transactionStarted = true;

    const result = await action();

    await db.exec("COMMIT");

    return result;
  } catch (error) {
    if (transactionStarted) {
      await db.exec("ROLLBACK").catch(() => {});
    }

    throw error;
  }
}

module.exports = runInTransaction;
