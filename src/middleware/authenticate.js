const { poolQuery } = require("../db");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const authToken = req.get("Authorization").split(" ")[1];

    //verify authToken user sent. If unable to verify, error will be thrown
    const token = jwt.verify(authToken, process.env.JWT_KEY);

    //make sure the user and their authToken exists
    const userAuthTokenResponse = await poolQuery(
      `SELECT user_account_id FROM user_auth_token
      WHERE user_account_id=${token.user_account_id} AND auth_token='${authToken}'`
    );

    //Send error if cant find that user with authToken
    if (userAuthTokenResponse.rowCount === 0) {
      return res.status(401).send("Unable to validate");
    }

    const userId = userAuthTokenResponse.rows[0].user_account_id;

    //find user details to send back with our request
    const userResponse = await poolQuery(
      `SELECT * FROM user_account
      WHERE user_account_id=${userId}`
    );

    req.user = userResponse.rows[0];

    //send authToken as well
    req.authToken = authToken;

    next();
  } catch (e) {
    res.status(401).send("Unable to authenticate");
  }
};

module.exports = authenticate;
