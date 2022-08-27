const { poolQuery } = require("../../src/db");

//strictly for my testing,so very simplified
const addReview = async (userId, mediaId, review, rating) => {
  await poolQuery(
    `INSERT INTO user_review(user_account_id,media_id,review,rating) VALUES($1,$2,$3,$4)`,
    [userId, mediaId, review, rating]
  );
};

const clearUserReviewTable = async () => {
  await poolQuery(`DELETE FROM user_review`);
};

module.exports = { addReview, clearUserReviewTable };
