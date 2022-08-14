//clear user_account table which means clearing user_auth_token first due to relationship

const { getClient } = require("../../src/db");

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

module.exports = { clearUserAccountTable };
