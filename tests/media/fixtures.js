const { poolQuery, getClient } = require("../../src/db");

const exampleMedia1 = {
  media_id: "1",
  media_source_id: 2,
  user_account_id: 1,
  media_type_id: 1,
  title: "Penguins",
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

const exampleMedia2 = {
  media_id: "2",
  media_source_id: 2,
  user_account_id: 2,
  media_type_id: 1,
  title: "We are champions",
  date_uploaded: "2022-08-14",
};

const clearMediaTable = async () => {
  await poolQuery("DELETE FROM media");
};

module.exports = {
  clearMediaTable,
  exampleMedia1,
  exampleMedia1a,
  exampleMedia2,
};
