import { Room } from 'colyseus';
import * as mysql from 'promise-mysql';
import { initDB, logger } from '../common.mjs';

const clientsArray = {};
const authsArray = {};

export default class authroom extends Room {
  onCreate() {
    const dbcon = initDB();
    this.dbcon = dbcon;
    this.roomName = 'authroom';
    this.found = false;
    this.room = this;
    this.clientsArray = [];
    this.onMessage('get_own_characters', async (client) => {
      // console.log(client.sessionId+": "+JSON.stringify(message));
      const playerid = client.sessionId;
      logger.debug('Got get_own_characters');
      logger.debug('Fetching characters');
      await this.dbcon.query(`SELECT * FROM characters WHERE owner_id = ${clientsArray[playerid].id}`, (error, results) => {
        if (typeof error !== 'undefined') {
          logger.error(error);
        }
        const charsData = [];
        for (let r = 0; r < results.length; r += 1) {
          if (r > 6) {
            break;
          }
          r = results[r];
          charsData.push(r);
          logger.debug('Sending characters data');
          logger.debug(charsData);
          for (let i = 0; i < charsData.length; i += 1) {
            client.send(`charData_${i}`, charsData[i]);
          }
          if (r === charsData.length) {
            client.send('charData_done');
          }
        }
      });
    });
    logger.info('Room created');
  }

  onAuth(client, options) {
    const { username } = options;
    const passv = options.password;
    const sid = client.sessionId;
    logger.debug(`${username}:${passv}`);
    let r = null;
    this.dbcon.query(`SELECT * FROM users WHERE username = ${mysql.escape(username)} AND password = ${mysql.escape(passv)};`, (error, results) => {
      if (error !== null) {
        logger.error(error);
        r = false;
      } else if (results.length === 1) {
        logger.debug('Authed');
        authsArray[sid] = {};
        authsArray[sid].id = results[0].id;
        authsArray[sid].authed = true;
        r = true;
      } else {
        if (results.length > 1) {
          logger.warn('Multiple users found with username:password combination of:');
          logger.warn(`${username}:${passv}`);
        }
        r = false;
      }
    });
    if (r === false) {
      throw new Error('Invalid username or password!');
    } else if (r !== null) {
      //
    }
  }

  onJoin(client, options) {
    logger.info(`${options.username} joined authroom!`);
  }

  onLeave(client, consented) {
    if (!consented) {
      logger.info(`${client.id} crashed`);
    } else {
      logger.info(`${client.id} left`);
    }
  }

  onDispose() {
    logger.info(`Closing room :${this.roomId}`);
  }
}
