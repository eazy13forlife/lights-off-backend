const request = require("supertest");

const app = require("../../src/app");
const { poolQuery } = require("../../src/db");
const runGlobalSetup = require("../globalSetup.js");
const {
  exampleUser1,
  exampleUser2,
  removeAuthTokenFromUser,
  clearUserAccountTable,
} = require("./fixtures");

beforeEach(async () => {
  await runGlobalSetup();
});

afterEach(async () => {
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

  const insertedUser = response._body.user;

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

test("Do not sign up a new user with an invalid email", async () => {
  await request(app)
    .post("/users/signup")
    .send({
      email: "eric",
      username: "ericisthebest",
      password: "ericrocks",
    })
    .expect("Invalid email");
});

test("Do not sign up a new user without at least 4 characters in username", async () => {
  await request(app)
    .post("/users/signup")
    .send({
      email: "eric@yahoo.com",
      username: "eri",
      password: "ericrocks",
    })
    .expect("Username must be at least 4 characters");
});

test("Do not sign up a new user without at least 4 characters in password", async () => {
  await request(app)
    .post("/users/signup")
    .send({
      email: "eric@yahoo.com",
      username: "ericisthebest",
      password: "eri",
    })
    .expect("Password must be at least 4 characters");
});

test("Login exampleUser1 when they provide their valid login data", async () => {
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

test("Do not login exampleUser1 if they provide a missing required field", async () => {
  //expect 400 if a field is missing
  await request(app)
    .post("/users/login")
    .send({ password: exampleUser1.loginData.password })
    .expect(400);
});

test("Do not login exampleUser1 if their username is not found", async () => {
  await request(app)
    .post("/users/login")
    .send({ username: "jwillis", password: exampleUser1.loginData.password })
    .expect(401);
});

test("Do not login exampleUser1 if their password is incorrect", async () => {
  //expect 401 if passwords dont match up
  await request(app)
    .post("/users/login")
    .send({ username: exampleUser1.loginData.username, password: "asdsds" })
    .expect(401);
});

test("The authenticate middleware should succeed for exampleUser1 when they provide their correct authToken", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("The authentication middleware should fail for an invalid authToken", async () => {
  //user's token cannot be verified
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer 323423`)
    .send()
    .expect(401);
});

test("The authentication middleware should fail when exampleUser2 does not currently have the authToken they are using", async () => {
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

test("ExampleUser1 logging out successfully should return a 200 status code ", async () => {
  //user's token cannot be verified
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("After exampleUser1 logs out,retrieving a private route should result in a 401 unauthorized because their authToken does not exist anymore.", async () => {
  //user's token cannot be verified
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(401);
});
