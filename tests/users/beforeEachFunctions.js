const bcrypt = require("bcryptjs");
const { poolQuery, getClient } = require("../../src/db");

const exampleUser1 = {
  email: "johnny@ayhoo.com",
  username: "johnnyrocks",
  password: "icecream",
};

const addExampleUserToUserAccount = async (exampleUser) => {
  const hashedPassword = await bcrypt.hash(exampleUser.password, 8);

  await poolQuery(
    `INSERT INTO user_account (email,username,password)
    VALUES($1,$2,$3)`,
    [exampleUser.email, exampleUser.username, hashedPassword]
  );
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
