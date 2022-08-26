const {
  clearUserAccountTable,
  addExampleUserToUserAccount,
  exampleUser1,
  exampleUser2,
} = require("./users/fixtures");
const { clearMediaTable } = require("./media/fixtures");

//create exampleUser1 and exampleUser2
const runGlobalSetup = async () => {
  await addExampleUserToUserAccount(exampleUser1);
  await addExampleUserToUserAccount(exampleUser2);
};

module.exports = runGlobalSetup;
