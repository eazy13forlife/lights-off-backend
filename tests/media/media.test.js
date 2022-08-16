const app = require("../../src/app");
const request = require("supertest");
const { poolQuery, getClient } = require("../../src/db");
const insertDataToMediaTable = require("../../src/helperFunctions/media");
const { exampleMedia1, clearMediaTable } = require("./beforeEachFunctions");

beforeEach(async () => {
  await clearMediaTable();
});

test("Do not throw error if inserting valid data to media table", async () => {
  await expect(
    insertDataToMediaTable("poolQuery", poolQuery, exampleMedia1)
  ).resolves.not.toThrow();
});

test("Throw error if inserting invalid data to media table", async () => {
  //required values are missing
  await expect(
    insertDataToMediaTable("poolQuery", poolQuery, { media_id: "5dfd" })
  ).rejects.toThrow();
});

test("Expect 201 response when adding valid data to media table", async () => {});
