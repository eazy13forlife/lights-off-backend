const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { poolQuery, getClient } = require("../../src/db");

//provide user_account_id ourselves so we can easily find user when we need to update its other tables.
//provide authToken for user,which will be added to db, so every test can run in isolation
const exampleUser1 = {
  loginData: {
    email: "johnny@ayhoo.com",
    username: "johnnyrocks",
    password: "icecream",
  },
  user_account_id: 1,
  authToken: uuidv4(),
};

const addExampleUserToUserAccount = async (exampleUser) => {
  const client = await getClient();

  try {
    const hashedPassword = await bcrypt.hash(exampleUser.loginData.password, 8);

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO user_account(user_account_id,email,username,password)
      VALUES($1,$2,$3,$4)`,
      [
        exampleUser.user_account_id,
        exampleUser.loginData.email,
        exampleUser.loginData.username,
        hashedPassword,
      ]
    );

    //user should have an authToken in db as well so every test can be run in isolation
    await client.query(
      `INSERT INTO user_auth_token(user_account_id,auth_token)
      VALUES($1,$2)`,
      [exampleUser.user_account_id, exampleUser.authToken]
    );

    await client.query("COMMIT");
  } catch {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

//clear user_account table which means clearing user_auth_token first due to relationship
const clearUserAccountTable = async () => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM user_auth_token");

    await client.query("DELETE FROM user_account");

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");

    throw new Error(e);
  } finally {
    client.release();
  }
};

module.exports = {
  clearUserAccountTable,
  addExampleUserToUserAccount,
  exampleUser1,
};
