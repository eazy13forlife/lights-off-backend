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

const getPaginatedItems = async (page, userId, table) => {
  if (page <= 0) {
    return {
      status: 400,
      message: "Page number must not be negative",
    };
  }

  //get the total number of "criteria" for user. For example, favorites, or seen or watch next
  const countResponse = await poolQuery(
    `SELECT COUNT(user_account_id) FROM ${table}
    WHERE user_account_id=${userId}`
  );

  const numberOfItems = +countResponse.rows[0].count;

  //number of results we want to return back to user per page
  const resultsPerPage = 20;

  //get total number of pages of data, accounting for resultsPerPage
  const totalPages = Math.ceil(numberOfItems / resultsPerPage);

  //the amount of data we skip per page, before getting the amount of results per page
  const offsetAmount = (page - 1) * 20;

  const getAllResponse = await poolQuery(
    `SELECT * FROM ${table}
    INNER JOIN media
    ON ${table}.media_id=media.media_id
    WHERE ${table}.user_account_id=${userId}
    ORDER BY media.media_id
    LIMIT ${resultsPerPage} OFFSET ${offsetAmount}`
  );

  const allItems = getAllResponse.rows;

  return {
    status: 200,
    message: {
      total_pages: totalPages,
      total_results: numberOfItems,
      page: page,
      results: allItems,
    },
  };
};

const getPaginatedSearchItems = async (mediaTitle, page, userId, table) => {
  if (page <= 0) {
    return {
      status: 400,
      message: "Page number must not be negative",
    };
  }

  //get the total number of "criteria" for user. For example, favorites, or seen or watch next
  const countResponse = await poolQuery(
    `SELECT COUNT(${table}.user_account_id) FROM ${table}
    INNER JOIN media
    ON ${table}.media_id=media.media_id
    WHERE ${table}.user_account_id=${userId} AND media.title ILIKE '%${mediaTitle}%'`
  );

  const numberOfItems = +countResponse.rows[0].count;

  //number of results we want to return back to user per page
  const resultsPerPage = 20;

  //get total number of pages of data, accounting for resultsPerPage
  const totalPages = Math.ceil(numberOfItems / resultsPerPage);

  //the amount of data we skip per page, before getting the amount of results per page
  const offsetAmount = (page - 1) * 20;

  const getAllResponse = await poolQuery(
    `SELECT * FROM ${table}
    INNER JOIN media
    ON ${table}.media_id=media.media_id
    WHERE ${table}.user_account_id=${userId} AND media.title ILIKE '%${mediaTitle}%'
    ORDER BY media.media_id
    LIMIT ${resultsPerPage} OFFSET ${offsetAmount}`
  );

  const allItems = getAllResponse.rows;

  return {
    status: 200,
    message: {
      total_pages: totalPages,
      total_results: numberOfItems,
      page: page,
      results: allItems,
    },
  };
};

module.exports = {
  insertDataToTable,
  updateTableValues,
  getPaginatedItems,
  getPaginatedSearchItems,
};
