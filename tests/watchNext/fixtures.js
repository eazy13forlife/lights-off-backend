const { poolQuery } = require("../../src/db");

const addMediaToWatchNext = async (userId, mediaId, priorityLevel) => {
  await poolQuery(
    `INSERT INTO user_watch_next(user_account_id,media_id,priority_level) VALUES($1,$2,$3)`,
    [userId, mediaId, priorityLevel]
  );
};

const clearWatchNextTable = async () => {
  await poolQuery(`DELETE FROM user_watch_next`);
};

module.exports = { addMediaToWatchNext, clearWatchNextTable };
