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
const { addMediaToFavorites, clearUserFavoriteTable } = require("./fixtures");

//after globalSetup
//imdbMedia1 is uploaded to media table
//exampleUser1 uploads exampleMedia1,exampleMedia1a,exampleMedia1b
//exampleUser1 adds exampleMedia1 and exampleMedia1a to their favorites
beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToMediaTable("poolQuery", poolQuery, imdbMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1a);
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1b);
  await addMediaToFavorites(
    exampleUser1.user_account_id,
    exampleMedia1.media_id
  );
  await addMediaToFavorites(
    exampleUser1.user_account_id,
    exampleMedia1a.media_id
  );
});

//to avoid foreign key errors,
//clear user_favorite table first since it depends on media_table and user_account table
//clear media_table since it depends on user_account table
//clear user_account table
afterEach(async () => {
  await clearUserFavoriteTable();
  await clearMediaTable();
  await clearUserAccountTable();
});

test("Get a 200 code when exampleUser1 adds exampleMedia1b to their favorites", async () => {
  await request(app)
    .post("/favorites/1b")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 200 code when exampleUser1 adds imdbMedia1 to their favorites", async () => {
  await request(app)
    .post(`/favorites/${imdbMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 error code when exampleUser2 tries to add exampleMedia1 that they didnt upload to their favorites", async () => {
  await request(app)
    .post(`/favorites/${exampleUser1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 error code when exampleUser2 tries to add non-existent media to their favorites", async () => {
  await request(app)
    .post(`/favorites/434`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 code when exampleUser1 deletes exampleMedia1 that they uploaded from their favorites", async () => {
  await request(app)
    .delete(`/favorites/1`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 code when exampleUser2 tries to delete exampleMedia1 that they did not upload from their favorites", async () => {
  await request(app)
    .delete(`/favorites/1`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 code when exampleUser2 tries to delete non-existent media from their favorites", async () => {
  await request(app)
    .delete(`/favorites/34`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 code when exampleUser1 tries to get all their favorites", async () => {
  await request(app)
    .get(`/favorites`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get back 2 results when exampleUser1 tries to get all their favorites", async () => {
  const response = await request(app)
    .get(`/favorites`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});
