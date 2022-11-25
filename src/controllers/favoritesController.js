const { poolQuery } = require("../db");
const {
  preventUserAccessingMedia,
  checkMediaExistsInTableForUser,
} = require("../helperFunctions/media");
const {
  getPaginatedItems,
  getPaginatedSearchItems,
} = require("../helperFunctions/global.js");

const getAllFavorites = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    //get current page asked for from query.Convert to number
    const page = +req.query.page;

    const { status, message } = await getPaginatedItems(
      page,
      userId,
      "user_favorite"
    );

    return res.status(status).send(message);
  } catch (e) {
    res.status(400).send();
  }
};

const checkMediaInFavorites = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;

    const userId = req.user.user_account_id;

    const response = await checkMediaExistsInTableForUser(
      "user_favorite",
      mediaId,
      userId
    );

    return res.status(response.statusCode).send();
  } catch (e) {
    res.status(400).send();
  }
};

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

    const insertResponse = await poolQuery(
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

    const deleteResponse = await poolQuery(`
    DELETE FROM user_favorite
    WHERE media_id='${mediaId}' AND user_account_id=${userId}
    `);

    if (deleteResponse.rowCount === 0) {
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

const searchInFavorites = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    const mediaTitle = req.query.title;

    const page = +req.query.page;

    const { status, message } = await getPaginatedSearchItems(
      mediaTitle,
      page,
      userId,
      "user_favorite"
    );

    res.status(status).send(message);
  } catch (e) {
    res.status(400).send();
  }
};

module.exports = {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
  checkMediaInFavorites,
  searchInFavorites,
};
