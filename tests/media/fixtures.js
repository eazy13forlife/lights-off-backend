const { poolQuery, getClient } = require("../../src/db");
const { insertDataToTable } = require("../../src/helperFunctions/global");

const exampleMedia1 = {
  media_id: "1",
  media_source_id: 2,
  user_account_id: 1,
  media_type_id: 1,
  title: "Penguins love",
  date_uploaded: "2022-08-13",
};

const exampleMedia1a = {
  media_id: "1a",
  media_source_id: 2,
  user_account_id: 1,
  media_type_id: 1,
  title: "Love is Life",
  date_uploaded: "2022-08-14",
};

const exampleMedia1b = {
  media_id: "1b",
  media_source_id: 2,
  user_account_id: 1,
  media_type_id: 1,
  title: "We all love each other",
  date_uploaded: "2022-08-14",
};

const exampleMedia2 = {
  media_id: "2",
  media_source_id: 2,
  user_account_id: 2,
  media_type_id: 1,
  title: "We are champions",
  date_uploaded: "2022-08-14",
};

const imdbMedia1 = {
  media_id: "imdb1",
  media_source_id: 1,
  media_type_id: 1,
  title: "Thor",
};

const imdbMedia2 = {
  media_id: "imdb2",
  media_source_id: 1,
  media_type_id: 1,
  title: "Spiderman",
};

const clearMediaTable = async () => {
  await poolQuery("DELETE FROM media");
};

const addMedia = async (mediaData) => {
  const insertResponse = await insertDataToTable("media", mediaData);
};
module.exports = {
  clearMediaTable,
  exampleMedia1,
  exampleMedia1a,
  exampleMedia1b,
  exampleMedia2,
  imdbMedia1,
  imdbMedia2,
};
