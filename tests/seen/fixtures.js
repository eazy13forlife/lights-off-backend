const { poolQuery } = require("../../src/db");

const clearUserSeenTable = async () => {
  await poolQuery(`DELETE FROM user_seen`);
};

const addMediaToSeen = async (userId, mediaId) => {
  await poolQuery(
    `INSERT INTO user_seen(user_account_id,media_id) VALUES($1,$2)`,
    [userId, mediaId]
  );
};

module.exports = { clearUserSeenTable, addMediaToSeen };
