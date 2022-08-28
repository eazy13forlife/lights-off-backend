const { poolQuery } = require("../db");

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

const updateTableValues = async (table, updateData, conditions) => {
  let text = `UPDATE ${table}
  SET ${getUpdateText(updateData)}
  WHERE ${conditions}
  RETURNING *`;

  const values = Object.values(updateData);

  const updateResponse = await poolQuery(text, values);

  return updateResponse;
};

module.exports = updateTableValues;
