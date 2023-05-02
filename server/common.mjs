import log4js from 'log4js';
import * as mysql from 'mysql';
import { logLevel, db as configDB } from './config.mjs';

log4js.configure({
  appenders: { file: { type: 'file', filename: 'log.log' }, console: { type: 'console' } },
  categories: { default: { appenders: ['file', 'console'], level: 'debug' } },
});

const logger = log4js.getLogger();
logger.level = logLevel || 'info';

function initDB() {
  const dbconfig = {
    host: configDB.DB_HOST || 'localhost',
    port: configDB.DB_PORT || 3306,
    user: configDB.DB_USERNAME,
    password: configDB.DB_PASSWORD,
    database: configDB.DB_NAME,
    timezone: 'local',
    connectTimeout: 10000,
    connectionLimit: 10,
  };
  const dbcon = mysql.createConnection(dbconfig);
  dbcon.query(`USE ${configDB.DB_NAME}`);
  return dbcon;
}

export { logger, initDB };
