const { poolQuery } = require("../../db");

const preventUserAccessingMedia = async (userId, mediaId) => {
  const mediaResponse = await poolQuery(
    `SELECT * FROM media
    WHERE media_id='${mediaId}'`
  );

  //the media is not found at all in mediaTable
  if (mediaResponse.rowCount === 0) {
    return {
      errorCode: 404,
      errorMessage: `media_id ${mediaId} is not found.`,
    };
  }

  const userIdForMedia = mediaResponse.rows[0].user_account_id;

  //the userId exists for the media but doesnt match the userId of current user
  if (userIdForMedia && userIdForMedia !== userId) {
    return {
      errorCode: 404,
      errorMessage: `media_id ${mediaId} is not found for user_account_id ${userId}.`,
    };
  }

  //if no userId means imdb movie so user has access. And if there is a  userId for media that matches with current userId, its theirs so they have access
  return false;
};

module.exports = {
  preventUserAccessingMedia,
};
