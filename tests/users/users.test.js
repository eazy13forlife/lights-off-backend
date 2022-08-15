const request = require("supertest");

const { poolQuery, getClient } = require("../../src/db");
const {
  clearUserAccountTable,
  addExampleUserToUserAccount,
  removeAuthTokenFromUser,
  exampleUser1,
  exampleUser2,
} = require("./beforeEachFunctions");
const app = require("../../src/app");

beforeEach(async () => {
  await clearUserAccountTable();
  await addExampleUserToUserAccount(exampleUser1);
  await addExampleUserToUserAccount(exampleUser2);
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

  //expect authToken to be in user's user_auth_token table
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

test("Login valid user", async () => {
  //expect a 200 status code
  const response = await request(app)
    .post("/users/login")
    .send(exampleUser1.loginData)
    .expect(200);

  //expect authToken to be in user's user_auth_token table
  const authTokenResult = await poolQuery(
    `SELECT auth_token FROM user_auth_token
    WHERE  auth_token='${response._body.authToken}'`
  );

  expect(authTokenResult.rowCount).toBe(1);
});

test("Do not login invalid user", async () => {
  //expect 400 if a field is missing
  await request(app)
    .post("/users/login")
    .send({ password: exampleUser1.loginData.password })
    .expect(400);

  //expect 401 if username is not found
  await request(app)
    .post("/users/login")
    .send({ username: "jwillis", password: exampleUser1.loginData.password })
    .expect(401);

  //expect 401 if passwords dont match up
  await request(app)
    .post("/users/login")
    .send({ username: exampleUser1.loginData.username, password: "asdsds" })
    .expect(401);
});

test("The authenticate middleware should succeed for a valid user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("The authentication middleware should fail for an invalid user", async () => {
  //user's token cannot be verified
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer 323423`)
    .send()
    .expect(401);

  //auth token is verified but does not currently belong to the user
  await removeAuthTokenFromUser(
    exampleUser2.user_account_id,
    exampleUser2.authToken
  );

  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(401);
});
