const request = require("supertest");

const { poolQuery, getClient } = require("../../src/db");
const { clearUserAccountTable } = require("./beforeEachFunctions");
const app = require("../../src/app");

beforeEach(async () => {
  await clearUserAccountTable();
});

test("Sign up a valid new user", async () => {
  //expect a 201 status code from signing up valid user
  const response = await request(app)
    .post("/users/signup")
    .send({
      email: "eric@yahoo.com",
      username: "ericisthebest",
      password: "ericrocks",
    })
    .expect(201);

  const insertedUser = response._body.insertedUser;

  //expect user to exist in our database
  expect(insertedUser).toBeTruthy();

  //expect authToken to be in user_auth_token table
  const authTokenResult = await poolQuery(`
  SELECT auth_token FROM  user_auth_token
  WHERE auth_token='${response._body.authToken}' AND user_account_id=${insertedUser.user_account_id}`);

  expect(authTokenResult.rowCount).toBe(1);

  //expect hashed password is saved in database
  expect(insertedUser.password).not.toBe("ericrocks");
});

test("Do not sign up invalid new user", async () => {
  //either email is invalid
  await request(app)
    .post("/users/signup")
    .send({
      email: "eric",
      username: "ericisthebest",
      password: "ericrocks",
    })
    .expect("Invalid email");

  //either username is not at least 4 characters
  await request(app)
    .post("/users/signup")
    .send({
      email: "eric@yahoo.com",
      username: "eri",
      password: "ericrocks",
    })
    .expect("Username must be at least 4 characters");

  //either password is not at least 4 characters
  await request(app)
    .post("/users/signup")
    .send({
      email: "eric@yahoo.com",
      username: "ericisthebest",
      password: "eri",
    })
    .expect("Password must be at least 4 characters");
});
