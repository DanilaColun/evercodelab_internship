const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const initDatabase = require("../src/database/initDatabase");
const openDatabase = require("../src/database/databaseConnection");

async function createTestDatabase() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "evercodelab-db-"));
  const filename = path.join(tempDir, "test.sqlite");

  await initDatabase({
    filename,
  });

  const db = await openDatabase({
    filename,
  });

  async function close() {
    await db.close();
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }

  return {
    db,
    filename,
    close,
  };
}

module.exports = createTestDatabase;
