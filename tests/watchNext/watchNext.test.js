const request = require("supertest");

const app = require("../../src/app");
const { poolQuery } = require("../../src/db");
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
const { addMediaToWatchNext, clearWatchNextTable } = require("./fixtures");

//after globalSetup
//imdbMedia1 is uploaded to media table
//exampleUser1 uploads exampleMedia1,exampleMedia1a,exampleMedia1b
//exampleUser1 adds exampleMedia1 and exampleMedia1a to their watchNext
beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToMediaTable("poolQuery", poolQuery, imdbMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1a);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1b);
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
