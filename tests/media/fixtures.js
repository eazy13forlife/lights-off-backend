const { poolQuery, getClient } = require("../../src/db");

const exampleMedia1 = {
  media_id: "2323",
  media_source_id: 1,
  media_type_id: 1,
  title: "Penguins",
};

const clearMediaTable = async () => {
  await poolQuery("DELETE FROM media");
};

module.exports = { clearMediaTable, exampleMedia1 };
