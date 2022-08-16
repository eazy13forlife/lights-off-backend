const {
  clearUserAccountTable,
  addExampleUserToUserAccount,
  exampleUser1,
  exampleUser2,
} = require("./users/fixtures");
const { clearMediaTable } = require("./media/fixtures");
const runGlobalSetup = async () => {
  await addExampleUserToUserAccount(exampleUser1);
  await addExampleUserToUserAccount(exampleUser2);
};

module.exports = runGlobalSetup;
