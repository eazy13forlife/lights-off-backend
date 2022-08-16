const {
  clearUserAccountTable,
  addExampleUserToUserAccount,
  exampleUser1,
  exampleUser2,
} = require("./users/fixtures");

const runGlobalSetup = async () => {
  await clearUserAccountTable();
  await addExampleUserToUserAccount(exampleUser1);
  await addExampleUserToUserAccount(exampleUser2);
};

module.exports = runGlobalSetup;
