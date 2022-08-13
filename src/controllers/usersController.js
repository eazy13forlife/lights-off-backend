const UserData = require("../helperFunctions/users/UserData");
const { poolQuery } = require("../db");

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

    //get the most recent row added
    res.status(201).send(response.rows[response.rows.length - 1]);
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
