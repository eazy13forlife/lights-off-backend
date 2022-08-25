const { poolQuery } = require("../../src/db");

const clearUserSeenTable = async () => {
  await poolQuery(`DELETE FROM user_seen`);
};

module.exports = clearUserSeenTable;
