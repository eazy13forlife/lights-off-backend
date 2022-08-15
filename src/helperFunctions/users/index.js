const { poolQuery } = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

//i put has property with payload to ensure a new token each time for a specific user
const generateAuthToken = (userId) => {
  return jwt.sign(
    {
      user_account_id: userId,
      hash: uuidv4(),
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
