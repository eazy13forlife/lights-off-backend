const request = require("supertest");

const app = require("../../src/app");
const { poolQuery } = require("../../src/db");
const runGlobalSetup = require("../globalSetup");
const { insertDataToTable } = require("../../src/helperFunctions/global");
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
const { addMediaToWatchNext, clearWatchNextTable } = require("./fixtures");

//after globalSetup
//imdbMedia1 is uploaded to media table
//exampleUser1 uploads exampleMedia1,exampleMedia1a,exampleMedia1b
//exampleUser1 adds exampleMedia1 and exampleMedia1a to their watchNext
beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToTable("media", imdbMedia1);
  await insertDataToTable("media", exampleMedia1);
  await insertDataToTable("media", exampleMedia1a);
  await insertDataToTable("media", exampleMedia1b);
  await addMediaToWatchNext(
    exampleUser1.user_account_id,
    exampleMedia1.media_id,
    "high"
  );
  await addMediaToWatchNext(
    exampleUser1.user_account_id,
    exampleMedia1a.media_id,
    null
  );
});

//to avoid foreign key errors,
//clear user_watch_next table first since it depends on media_table and user_account table
//clear media_table since it depends on user_account table
//clear user_account table
afterEach(async () => {
  await clearWatchNextTable();
  await clearMediaTable();
  await clearUserAccountTable();
});

test("Get a 200 status code when exampleUser1 successfully add exampleMedia1b they uploaded to their watch next", async () => {
  await request(app)
    .post("/watch-next/1b")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 200 status code when exampleUser1 successfully adds imdbMedia1 to their watch next.", async () => {
  await request(app)
    .post(`/watch-next/${imdbMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 status code when exampleUser2 tries to add exampleMedia1b they didn't upload to their watch next", async () => {
  await request(app)
    .post("/watch-next/1b")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 status code when exampleUser2 tries to add non-existent media in the database to their watch next", async () => {
  await request(app)
    .post("/watch-next/43434")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 status code when exampleUser1 successfully deletes exampleMedia1 they uploaded from their watch next.", async () => {
  await request(app)
    .delete(`/watch-next/1`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 status code when exampleUser2 tries to delete exampleMedia1 they didnt upload from their watch next.", async () => {
  await request(app)
    .delete(`/watch-next/1`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 status code when exampleUser2 tries to delete non-existent media in database from their watch next.", async () => {
  await request(app)
    .delete(`/watch-next/423`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 status code when exampleUser1 tries to get all media from their watch next.", async () => {
  await request(app)
    .get("/watch-next/?page=1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get 2 media items back when exampleUser1 tries to get all media from their watch next.", async () => {
  const response = await request(app)
    .get("/watch-next/?page=1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  expect(response.body.results.length).toBe(2);
});

test("Get a 200 status code when exampleUser1 tries to check if exampleMedia1 they added to their watch next is in there.", async () => {
  await request(app)
    .head(`/watch-next/exists/${exampleMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 status code when exampleUser1 tries to check if exampleMedia1b they didn't add to their watch next is in there.", async () => {
  await request(app)
    .head(`/watch-next/exists/${exampleMedia1b.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(404);
});

test("Get 2 results when exampleUser1 searches for all media in watch-next that has the word 'love' in it.", async () => {
  const response = await request(app)
    .get("/watch-next/search/?title=love&page=1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  expect(response.body.total_results).toBe(2);
});

test("Get 1 result when exampleUser1 searches for all media in watch-next that has the word 'penguin' in it.", async () => {
  const response = await request(app)
    .get("/watch-next/search/?title=penguin&page=1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  expect(response.body.total_results).toBe(1);
});
