const { poolQuery } = require("../db");

const getAllUploads = async (req, res) => {
  try {
    const userId = req.user.user_account_id;

    const response = await poolQuery(
      `SELECT * FROM media
      WHERE user_account_id=${userId}`
    );

    res.send(response.rows);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = getAllUploads;
