const insertDataToMediaTable = require("../helperFunctions/media");
const { poolQuery, getClient } = require("../db");

const addMedia = async (req, res) => {
  try {
    const mediaData = req.body;

    const response = await insertDataToMediaTable(
      "poolQuery",
      poolQuery,
      mediaData
    );

    console.log(response);

    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getAllMedia = (req, res) => {};

const deleteMedia = (req, res) => {};

const updateMedia = (req, res) => {};

module.exports = {
  addMedia,
  getAllMedia,
  deleteMedia,
  updateMedia,
};
