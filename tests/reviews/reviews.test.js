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
  imdbMedia2,
  clearMediaTable,
} = require("../media/fixtures");
const { clearUserReviewTable, addReview } = require("./fixtures");

//after globalSetup
//imdbMedia1 is uploaded to media table
//imdbMedia2 is uploaded to media table
//exampleUser1 uploads exampleMedia1,exampleMedia1a,exampleMedia1b
//exampleUser1 reviews exampleMedia1 and exampleMedia1a
//both exampleUser1 and exampleUser2 review imdbMedia2
beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToTable("media", imdbMedia1);
  await insertDataToTable("media", imdbMedia2);
  await insertDataToTable("media", exampleMedia1);
  await insertDataToTable("media", exampleMedia1a);
  await insertDataToTable("media", exampleMedia1b);
  await addReview(
    exampleUser1.user_account_id,
    exampleMedia1.media_id,
    "good",
    10
  );
  await addReview(
    exampleUser1.user_account_id,
    exampleMedia1a.media_id,
    "bad",
    0
  );
  await addReview(
    exampleUser2.user_account_id,
    imdbMedia2.media_id,
    "really good",
    0
  );
  await addReview(
    exampleUser1.user_account_id,
    imdbMedia2.media_id,
    "really good",
    0
  );
});

//to avoid foreign key errors,
//clear user_review table first since it depends on media_table and user_account table
//clear media_table since it depends on user_account table
//clear user_account table
afterEach(async () => {
  await clearUserReviewTable();
  await clearMediaTable();
  await clearUserAccountTable();
});

test("Get a 201 code when exampleUser1 successfully posts a review for an imdb movie", async () => {
  await request(app)
    .post(`/reviews/${imdbMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ review: "Not bad", rating: 10 })
    .expect(201);
});

test("Get a 201 code when exampleUser1 successfully posts a review for exampleMedia1b that they uploaded", async () => {
  await request(app)
    .post(`/reviews/${exampleMedia1b.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ review: "Not bad", rating: 10 })
    .expect(201);
});

test("Get a 404 error code when exampleUser2 tries to post a review for exampleMedia1b that they did not upload", async () => {
  await request(app)
    .post(`/reviews/${exampleMedia1b.media_id}`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send({ review: "Not bad", rating: 10 })
    .expect(404);
});

test("Get a 400 error code when exampleUser1 tries to post a review for exampleMedia1b that they uploaded but didn't write a review", async () => {
  await request(app)
    .post(`/reviews/${exampleMedia1b.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ rating: 10 })
    .expect(400);
});

test("Get a 400 error code when exampleUser1 tries to post a review for exampleMedia1b that they uploaded but add a rating greater than 10", async () => {
  await request(app)
    .post(`/reviews/${exampleMedia1b.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ rating: 12 })
    .expect(400);
});

test("Get a 200 code when exampleUser1 updates their current review for exampleMedia1.", async () => {
  await request(app)
    .patch("/reviews/1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ review: "I really love it" })
    .expect(200);
});

test("Get a 404 error code when exampleUser2 tries to update a review for exampleMedia1 that doesn't belong to them", async () => {
  await request(app)
    .patch("/reviews/1")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send({ review: "I really love it" })
    .expect(404);
});

test("Get a 200 success code when we get all reviews for imdbMedia2", async () => {
  await request(app)
    .get(`/reviews/${imdbMedia2.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 400 error code when we get all reviews for non-existent media", async () => {
  await request(app)
    .get(`/reviews/545`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(400);
});

test("Get 2 items back when we get all reviews for imdbMedia2", async () => {
  const response = await request(app)
    .get(`/reviews/${imdbMedia2.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});
