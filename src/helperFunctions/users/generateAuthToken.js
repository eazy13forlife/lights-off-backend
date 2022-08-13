const jwt = require("jsonwebtoken");

const generateAuthToken = (userId) => {
  return jwt.sign(
    {
      user_account_id: userId,
    },
    process.env.JWT_KEY
  );
};

module.exports = generateAuthToken;
