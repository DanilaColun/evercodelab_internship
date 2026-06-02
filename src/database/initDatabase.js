const fs = require("fs/promises");
const path = require("path");

const appConfig = require("../config/appConfig");
const DatabaseError = require("../errors/DatabaseError");
const Logger = require("../logger/logger");

const databaseConfig = require("./databaseConfig");
const openDatabase = require("./databaseConnection");

const logger = new Logger(appConfig.appName, {
  level: appConfig.logLevel,
});

async function initDatabase(options = {}) {
  const filename = options.filename || databaseConfig.filename;
  const schemaPath = options.schemaPath || path.join(__dirname, "schema.sql");

  let db;

  try {
    await fs.mkdir(path.dirname(filename), { recursive: true });

    db = await openDatabase({
      filename,
    });

    const schema = await fs.readFile(schemaPath, "utf8");

    await db.exec("BEGIN");
    await db.exec(schema);
    await db.exec("COMMIT");

    logger.info(`database initialized at ${filename}`);

    return {
      filename,
    };
  } catch (error) {
    if (db) {
      await db.exec("ROLLBACK").catch(() => {});
    }

    logger.error(`database initialization failed: ${error.message}`);

    throw new DatabaseError("database initialization failed", {
      context: {
        filename,
        schemaPath,
        originalMessage: error.message,
      },
    });
  } finally {
    if (db) {
      await db.close();
    }
  }
}

if (require.main === module) {
  initDatabase().catch(() => {
    process.exit(1);
  });
}

module.exports = initDatabase;
