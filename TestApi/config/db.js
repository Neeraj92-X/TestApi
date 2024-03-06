const mysql = require('mysql');
const util = require('util');
const logger = require('../logger');

function makeDb(config) {
  const pool = mysql.createPool(config);

  return {
    async query(sql, args) {
      const getConnection = util.promisify(pool.getConnection).bind(pool);
      const query = util.promisify(pool.query).bind(pool);
      let connection;
      try {
        connection = await getConnection();
        const results = await query(sql, args);
        return results;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        if (connection) {
          connection.release();
        }
      }
    },
    async close() {
      try {
        // This will end all the connections in the pool.
        await util.promisify(pool.end).bind(pool)();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };
}

module.exports = makeDb;