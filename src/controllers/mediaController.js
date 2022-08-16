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

    const insertedData = response.rows[0];

    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getMedia = (req, res) => {};

//we can only delete media that belongs to user,so check to see if media id belongs to user
const deleteMedia = (req, res) => {};

//we can only update media that belongs to user
const updateMedia = (req, res) => {};

module.exports = {
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
};
