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

const insertDataToTable = async (table, data) => {
  const tableColumns = Object.keys(data);

  const columnValues = Object.values(data);

  const text = `
  INSERT INTO ${table}(${getColumnsText(tableColumns)}) VALUES(${getValuesText(
    tableColumns.length
  )}) RETURNING *`;

  const insertResponse = await poolQuery(text, columnValues);

  return insertResponse;
};

// if (connectionType === "client") {
//   return await connection.query(text, values);
// } else if (connectionType === "poolQuery") {
//   return await connection(text, values);
// }

const getColumnsText = (columns) => {
  let text = "";

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    text += column;

    if (i !== columns.length - 1) {
      text += ",";
    }
  }

  return text;
};

const getValuesText = (numberOfValues) => {
  let text = "";

  for (let i = 0; i < numberOfValues; i++) {
    text += `$${i + 1}`;

    if (i !== numberOfValues - 1) {
      text += ",";
    }
  }

  return text;
};

module.exports = {
  insertDataToTable,
  updateTableValues,
};
