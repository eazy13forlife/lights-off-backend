const { poolQuery } = require("../../db");

//inserts a row to our media table
const insertDataToMediaTable = async (
  connectionType,
  connection,
  mediaData
) => {
  //get all values provided for the fields we will need
  const {
    media_id = null,
    media_source_id = null,
    media_type_id = null,
    user_account_id = null,
    title = null,
    release_year = null,
    rating = null,
    media_length = null,
    media_tagline = null,
    media_language = null,
    synopsis = null,
    media_image = null,
    date_uploaded = null,
    website = null,
    imdb = null,
  } = mediaData;

  const text = `INSERT INTO media(media_id, media_source_id,media_type_id, user_account_id,title,release_year,rating,media_length,media_tagline,media_language,synopsis,media_image,date_uploaded,website,imdb)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`;

  const values = [
    media_id,
    media_source_id,
    media_type_id,
    user_account_id,
    title,
    release_year,
    rating,
    media_length,
    media_tagline,
    media_language,
    synopsis,
    media_image,
    date_uploaded,
    website,
    imdb,
  ];

  if (connectionType === "client") {
    return await connection.query(text, values);
  } else if (connectionType === "poolQuery") {
    return await connection(text, values);
  }
};

const findMediaOfUser = async (userId, mediaId) => {
  const mediaResponse = await poolQuery(`
  SELECT * FROM (SELECT * FROM media WHERE media_id='${mediaId}') AS derived_table
  WHERE user_account_id=${userId}`);

  if (mediaResponse.rowCount === 0) {
    return undefined;
  }

  return mediaResponse.rows[0];
};

const updateMediaTableValues = async (mediaId, updateData) => {
  let text = `UPDATE media
  SET ${getUpdateText(updateData)}
  WHERE media_id='${mediaId}'
  RETURNING *`;

  values = Object.values(updateData);

  console.log(text);

  const response = await poolQuery(text, values);
};

const getUpdateText = (updateData) => {
  const columns = Object.keys(updateData);

  let text = "";

  for (let i = 0; i < columns.length; i++) {
    let currentColValString = `${columns[i]}=$${i + 1}`;

    text += currentColValString;

    if (i !== columns.length - 1) {
      text += ",";
    }
  }

  return text;
};

module.exports = {
  insertDataToMediaTable,
  findMediaOfUser,
  updateMediaTableValues,
};
