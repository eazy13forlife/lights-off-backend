const UserData = require("../helperFunctions/users/UserData");
const { poolQuery } = require("../db");
const generateAuthToken = require("../helperFunctions/users/generateAuthToken");

//need email, username and password fields
const createAccount = async (req, res) => {
  try {
    const user = new UserData(req.body);

    const dataErrors = user.checkIfDataErrors();

    if (dataErrors) {
      return res.status(dataErrors.statusCode).send(dataErrors.errorMessage);
    }

    const hashedPassword = await user.hashPassword();

    const response = await poolQuery(
      `INSERT INTO user_account(email,username,password) 
      VALUES($1,$2,$3)
      RETURNING *`,
      [req.body.email, req.body.username, hashedPassword]
    );

    //the most recent row is the user that was added
    const insertedUser = response.rows[response.rows.length - 1];

    //provide user with a jwt token and save it
    const authToken = generateAuthToken(insertedUser.user_account_id);

    await poolQuery(
      `INSERT INTO user_auth_token(user_account_id,auth_token)
       VALUES($1,$2)`,
      [insertedUser.user_account_id, authToken]
    );

    //send the added user and their authToken
    res.status(201).send({ insertedUser, authToken });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const loginToAccount = (req, res) => {};

const getAccountInfo = (req, res) => {};

const editAccountInfo = (req, res) => {};

const uploadProfilePic = (req, res) => {};

const editProfilePic = (req, res) => {};

module.exports = {
  createAccount,
  loginToAccount,
  getAccountInfo,
  editAccountInfo,
  uploadProfilePic,
  editProfilePic,
};
