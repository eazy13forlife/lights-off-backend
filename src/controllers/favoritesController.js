const { preventUserAccessingMedia } = require("../helperFunctions/media");
const { poolQuery } = require("../db");

const getAllFavorites = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    //get current page asked for from query.Convert to number
    const page = +req.query.page;

    if (page <= 0) {
      return res.status(400).send("Page number must not be negative");
    }

    //get the total number of favorites for user
    const countResponse = await poolQuery(
      `SELECT COUNT(user_account_id) FROM user_favorite
      WHERE user_account_id=${userId}`
    );

    const numberOfFavorites = +countResponse.rows[0].count;

    //number of results we want to return back to user per page
    const resultsPerPage = 20;

    //get total number of pages of data, accounting for resultsPerPage
    const totalPages = Math.ceil(numberOfFavorites / resultsPerPage);

    //the amount of data we skip per page, before getting the amount of results per page
    const offsetAmount = (page - 1) * 20;

    const getAllResponse = await poolQuery(
      `SELECT * FROM user_favorite
      INNER JOIN media
      ON user_favorite.media_id=media.media_id
      WHERE user_favorite.user_account_id=${userId}
      ORDER BY media.media_id
      LIMIT ${resultsPerPage} OFFSET ${offsetAmount}`
    );

    const allFavorites = getAllResponse.rows;

    res.send({
      total_pages: totalPages,
      total_results: numberOfFavorites,
      page: page,
      results: allFavorites,
    });
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

module.exports = {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
};
