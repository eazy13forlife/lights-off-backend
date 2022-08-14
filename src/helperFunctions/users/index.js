const { poolQuery } = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateAuthToken = (userId) => {
  return jwt.sign(
    {
      user_account_id: userId,
    },
    process.env.JWT_KEY
  );
};

const checkPassword = async (originalPassword, hashedPassword) => {
  return await bcrypt.compare(originalPassword, hashedPassword);
};

const sendUserAuthToken = async (userId) => {
  const authToken = generateAuthToken(userId);

  await poolQuery(
    `INSERT INTO user_auth_token(user_account_id,auth_token)
     VALUES($1,$2)`,
    [userId, authToken]
  );

  return authToken;
};

module.exports = { sendUserAuthToken, checkPassword };
