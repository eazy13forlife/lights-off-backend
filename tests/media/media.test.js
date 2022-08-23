const request = require("supertest");

const app = require("../../src/app");
const { poolQuery } = require("../../src/db");
const { insertDataToMediaTable } = require("../../src/helperFunctions/media");
const { exampleMedia1, exampleMedia2, clearMediaTable } = require("./fixtures");
const { exampleUser1, exampleUser2 } = require("../users/fixtures");
const { findMediaOfUser } = require("../../src/helperFunctions/media");
const runGlobalSetup = require("../globalSetup");

beforeEach(async () => {
  await runGlobalSetup();
  await insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1);
});

afterEach(async () => {
  await clearMediaTable();
});

test("Return the correct data when exampleUser1 is trying to find exampleMedia1", async () => {
  await expect(
    findMediaOfUser(exampleUser1.user_account_id, exampleMedia1.media_id)
  ).resolves.toBeDefined();
});

test("Return undefined if exampleUser2 is trying to find exampleUser1's media that doesn't belong to it", async () => {
  await expect(
    findMediaOfUser(exampleUser1.user_account_id, exampleMedia2.media_id)
  ).resolves.toBeUndefined();
});

test("Do not throw error if inserting valid data to media table", async () => {
  await expect(
    insertDataToMediaTable("poolQuery", poolQuery, exampleMedia2)
  ).resolves.not.toThrow();
});

test("Throw error if inserting invalid data to media table", async () => {
  //required values are missing
  await expect(
    insertDataToMediaTable("poolQuery", poolQuery, { media_id: "5dfd" })
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

test("Retrieve exampleMedia1 that exampleUser1 uploaded", async () => {
  await request(app)
    .get(`/media/${exampleMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Do not retrieve exampleMedia1(that exampleUser1 uploaded) for exampleUser2", async () => {
  await request(app)
    .get(`/media/${exampleMedia1.media_id}`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(400);
});

test("Do not retrieve nonexistant mediaId for exampleUser2", async () => {
  await request(app)
    .get(`/media/3232323`)
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(400);
});

test("Delete exampleMedia1 which is uploaded by exampleUser1", async () => {
  await request(app)
    .delete("/media/1")
    .set("Authorization", `Bearer ${exampleUser1.authToken}`)
    .send()
    .expect(200);
});

test("Do not let exampleUser2 delete exampleMedia1 (which belongs to exampleUser1)", async () => {
  await request(app)
    .delete("/media/1")
    .set("Authorization", `Bearer ${exampleUser2.authToken}`)
    .send()
    .expect(404);
});
