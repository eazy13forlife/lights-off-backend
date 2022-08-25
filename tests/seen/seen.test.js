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
const { exampleMedia1, clearMediaTable } = require("../media/fixtures");
const clearUserSeenTable = require("./fixtures");

beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1);
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

test("Get a 200 status code when exampleUser1 successfully deletes exampleMedia1", async () => {
  await request(app)
    .delete("/seen/1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 error status code when exampleUser2 tries to delete exampleMedia1 that they didn't upload", async () => {
  await request(app)
    .delete("/seen/1")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 error status code when exampleUser2 tries to delete non-existent media", async () => {
  await request(app)
    .delete("/seen/93")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});