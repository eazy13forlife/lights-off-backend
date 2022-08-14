const UserData = require("../helperFunctions/users/UserData");
const { poolQuery } = require("../db");
const {
  checkPassword,
  sendUserAuthToken,
} = require("../helperFunctions/users");

//need email, username and password fields
const createAccount = async (req, res) => {
  try {
    const user = new UserData(req.body, {
      email: true,
      password: true,
      username: true,
    });

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

    //send the user an authToken
    const authToken = await sendUserAuthToken(insertedUser.user_account_id);

    //respond with the added user and their authToken
    res.status(201).send({ insertedUser, authToken });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

//need to provide username and password. They will get back authToken
const loginToAccount = async (req, res) => {
  try {
    const userData = new UserData(req.body, { username: true, password: true });

    //check to make sure all required fields are entered
    const fieldsMissing = userData.checkAllRequiredFields();

    if (fieldsMissing) {
      return res
        .status(fieldsMissing.statusCode)
        .send(fieldsMissing.errorMessage);
    }

    //find user based on username
    const userResults = await poolQuery(
      `SELECT * FROM user_account
      WHERE username='${req.body.username}'`
    );

    if (!userResults.rows.length) {
      return res.status(401).send("Invalid credentials");
    }

    const user = userResults.rows[0];

    //compare users current hashed password and text password
    const doPasswordsMatch = await checkPassword(
      req.body.password,
      user.password
    );

    if (!doPasswordsMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const authToken = await sendUserAuthToken(user.user_account_id);

    res.send({ user, authToken });
  } catch (e) {
    res.status(401).send("Invalid credentials");
  }
};

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
