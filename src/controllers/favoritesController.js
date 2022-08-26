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

const deleteFromFavorites = (req, res) => {};

module.exports = {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
};
