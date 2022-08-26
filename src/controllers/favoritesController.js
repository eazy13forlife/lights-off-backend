const { preventUserAccessingMedia } = require("../helperFunctions/media");
const { poolQuery } = require("../db");

const getAllFavorites = (req, res) => {};

const addToFavorites = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const shouldPreventAccess = await preventUserAccessingMedia(
      userId,
      mediaId
    );

    if (shouldPreventAccess) {
      return res
        .status(shouldPreventAccess.errorCode)
        .send(shouldPreventAccess.errorMessage);
    }

    const favoritesResponse = await poolQuery(
      `INSERT INTO user_favorite(user_account_id,media_id) VALUES($1,$2)`,
      [userId, mediaId]
    );

    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const deleteFromFavorites = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const favoritesResponse = await poolQuery(`
    DELETE FROM user_favorite
    WHERE media_id='${mediaId}' AND user_account_id=${userId}
    `);

    if (favoritesResponse.rowCount === 0) {
      return res
        .status(404)
        .send(
          `media_id ${mediaId} is not found for user_account_id ${userId}.`
        );
    }

    res.send();
  } catch (e) {
    res.status(400).send();
  }
};

module.exports = {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
};
