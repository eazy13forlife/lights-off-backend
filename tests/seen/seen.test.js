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
  exampleMedia1b,
  imdbMedia1,
  clearMediaTable,
} = require("../media/fixtures");
const { clearUserSeenTable, addMediaToSeen } = require("./fixtures");

//imdbMedia1 is added to media
//user1 uploads 3 media: media1,media1a and media1b
//user1 adds media1 and media1a to their seen
beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToMediaTable("poolQuery", poolQuery, imdbMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1a);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1b);
  await addMediaToSeen(exampleUser1.user_account_id, exampleMedia1.media_id);
  await addMediaToSeen(exampleUser1.user_account_id, exampleMedia1a.media_id);
});

//to avoid foreign key errors
//user_seen depends on media and user_account table so clear user_seen first
//media table depends on user_account table so clear media table second
//clear user_account table last
afterEach(async () => {
  await clearUserSeenTable();
  await clearMediaTable();
  await clearUserAccountTable();
});

test("Get a 200 status code when exampleUser1 successfully posts exampleMedia1b to /seen/:mediaId route", async () => {
  await request(app)
    .post("/seen/1b")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 200 status code when exampleUser1 successfully an imdbMovie to /seen/:mediaId route", async () => {
  await request(app)
    .post(`/seen/${imdbMedia1.media_id}`)
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

  expect(response.body.length).toBe(2);
});
