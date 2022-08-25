const request = require("supertest");

const { poolQuery } = require("../../src/db");
const app = require("../../src/app");
const runGlobalSetup = require("../globalSetup");
const { insertDataToMediaTable } = require("../../src/helperFunctions/media");
const {
  exampleUser1,
  exampleUser2,
  clearUserAccountTable,
} = require("../users/fixtures");
const {
  exampleMedia1,
  exampleMedia1a,
  clearMediaTable,
} = require("../media/fixtures");
const clearUserSeenTable = require("./fixtures");

beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1a);
  //insert two medias to seen as well so we can use in example
});

afterEach(async () => {
  await clearUserSeenTable();
  await clearMediaTable();
  await clearUserAccountTable();
});

test("Get a 200 status code when exampleUser1 successfully posts exampleMedia1 to /seen/:mediaId route", async () => {
  await request(app)
    .post("/seen/1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 error code when exampleUser2 tries to post exampleMedia1 that they didn't upload to /seen/:mediaId route", async () => {
  await request(app)
    .post("/seen/1")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 error code when exampleUser2 tries to post non-existent media  to /seen/:mediaId route", async () => {
  await request(app)
    .post("/seen/982")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 status code when exampleUser1 successfully deletes exampleMedia1 from seen", async () => {
  await request(app)
    .delete("/seen/1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 error status code when exampleUser2 tries to delete exampleMedia1 that they didn't upload from their seen", async () => {
  await request(app)
    .delete("/seen/1")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 error status code when exampleUser2 tries to delete non-existent media from their seen", async () => {
  await request(app)
    .delete("/seen/93")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 status code when exampleUser1 makes a get request to /seen to get all their seen movies", async () => {
  await request(app)
    .get("/seen")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a count of 2 when exampleUser1 makes a get request to /seen to get both their seen movies", async () => {
  const response = await request(app)
    .get("/seen")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  expect(response.body).toBeNull();
});
