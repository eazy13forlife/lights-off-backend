const request = require("supertest");

const app = require("../../src/app");
const { poolQuery } = require("../../src/db");
const { insertDataToTable } = require("../../src/helperFunctions/global.js");
const {
  exampleMedia1,
  exampleMedia2,
  exampleMedia1b,
  imdbMedia1,
  clearMediaTable,
} = require("./fixtures");
const {
  exampleUser1,
  exampleUser2,
  clearUserAccountTable,
} = require("../users/fixtures");
const {
  preventUserAccessingMedia,
} = require("../../src/helperFunctions/media");
const runGlobalSetup = require("../globalSetup");

//imdbMedia1 is added to media
//user1 uploads exampleMedia1
beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToTable("media", imdbMedia1);
  await insertDataToTable("media", exampleMedia1);
});

afterEach(async () => {
  await clearMediaTable();
  await clearUserAccountTable();
});

test("Return a resolved promise when exampleUser1 tries to upload successful exampleMedia1", async () => {
  expect(insertDataToTable("media", exampleMedia1b)).resolves.not.toThrow();
});

test("Throw an error when exampleUser1 tries to upload incomplete or incorrect media data", async () => {
  expect(insertDataToTable("media", { title: "Hey" })).rejects.toThrow();
});

test("Do not prevent exampleUser1 from accessing exampleMedia1 that they uploaded, so preventUserAccessingMedia should return false", async () => {
  await expect(
    preventUserAccessingMedia(
      exampleUser1.user_account_id,
      exampleMedia1.media_id
    )
  ).resolves.toBeFalsy();
});

test("Do not prevent exampleUser1 from accessing imdbMedia, so preventUserAccessingMedia should return false", async () => {
  await expect(
    preventUserAccessingMedia(exampleUser1.user_account_id, imdbMedia1.media_id)
  ).resolves.toBeFalsy();
});

test("Prevent exampleUser2 from accessing exampleMedia1 that they didnt upload, so preventUserAccessingMedia should return the errorObject", async () => {
  await expect(
    preventUserAccessingMedia(
      exampleUser2.user_account_id,
      exampleMedia1.media_id
    )
  ).resolves.toBeTruthy();
});

test("Do not throw error if inserting valid data to media table", async () => {
  await expect(
    insertDataToTable("media", exampleMedia2)
  ).resolves.not.toThrow();
});

test("Throw error if inserting invalid data to media table", async () => {
  //required values are missing
  await expect(
    insertDataToTable("media", { media_id: "5dfd" })
  ).rejects.toThrow();
});

test("Expect 201 response when exampleUser2 is uploading valid exampleMedia2 data", async () => {
  await request(app)
    .post("/media")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send(exampleMedia2)
    .expect(201);
});

test("Expect 400 response when exampleUser2 is uploading media data with missing required fields", async () => {
  await request(app)
    .post("/media")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send({ media_id: "dsssf" })
    .expect(400);
});

test("Get a 200 response when exampleUser1 is retrieving exampleMedia1 that they uploaded", async () => {
  await request(app)
    .get(`/media/${exampleMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 error code when exampleUser2 is trying to retrieve exampleMedia1(that exampleUser1 uploaded)", async () => {
  await request(app)
    .get(`/media/${exampleMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 404 error code when exampleUser2 is trying to retrieve a nonexistant mediaId", async () => {
  await request(app)
    .get(`/media/3232323`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 code when exampleUser1 deleted exampleMedia1 that they uploaded", async () => {
  await request(app)
    .delete("/media/1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get a 404 error code when exampleUser2 tries to delete exampleMedia1 (which belongs to exampleUser1)", async () => {
  await request(app)
    .delete("/media/1")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});

test("Get a 200 code when exampleUser1 correctly updates exampleMedia1 that they uploaded", async () => {
  await request(app)
    .patch(`/media/1`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ title: "Pick me up" })
    .expect(200);
});

test("Get a 200 code when exampleUser1 correctly updates exampleMedia1 that they uploaded", async () => {
  await request(app)
    .patch(`/media/1`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ title: "Pick me up" })
    .expect(200);
});

test("Get a 404 error code when exampleUser2 is trying to update exampleMedia1 that they did not upload", async () => {
  await request(app)
    .patch(`/media/1`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send({ title: "Pick me up" })
    .expect(404);
});

test("Get a 400 error code when exampleUser1 is trying to update an invalid column on exampleMedia1", async () => {
  await request(app)
    .patch(`/media/1`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send({ pizza: "cheese" })
    .expect(400);
});

test("Get a 200 code when exampleUser1 tries to retrieve all their uploads", async () => {
  await request(app)
    .get("/uploads/me")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Get 1 result when exampleUser1 tries to retrieve all their uploads", async () => {
  const response = await request(app)
    .get("/uploads/me")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(1);
});

test("Get 0 results when exampleUser2 tries to retrieve all their uploads", async () => {
  const response = await request(app)
    .get("/uploads/me")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(0);
});
