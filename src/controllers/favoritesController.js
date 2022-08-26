const getAllFavorites = (req, res) => {};

const addToFavorites = (req, res) => {
  const mediaId = req.params.mediaId;

  const userId = req.user.user_account_id;
};

const deleteFromFavorites = (req, res) => {};

module.exports = {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
};
