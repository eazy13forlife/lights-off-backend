const { poolQuery } = require("../../src/db");

const addMediaToFavorites = async (userId, mediaId) => {
  await poolQuery(
    `INSERT INTO user_favorite(user_account_id,media_id) VALUES($1,$2)`,
    [userId, mediaId]
  );
};

const clearUserFavoriteTable = async () => {
  await poolQuery(`DELETE FROM user_favorite`);
};

module.exports = { addMediaToFavorites, clearUserFavoriteTable };
