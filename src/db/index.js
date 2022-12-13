const { Pool, Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  user: process.env.PGUSERHEROKU,
  host: process.env.PGHOSTHEROKU,
  port: process.env.PGPORTHEROKU,
  database: process.env.PGDATABASEHEROKU,
  password: process.env.PGPASSWORDHEROKU,
});

//we are exporting this object, which has to function poolQuery and getClient. poolQuery in an SQL text statement and params/values and calls pool.query with those values which returns a promise with our results so we return this promise back to our main poolQuery function. We can import this object as db and do await db.poolQuery(). getClient calls pool.connect() which returns a promise that resolves with our client so we return this client back to our main getClient function. When we import, we can do const client=await db.getClient()
module.exports = {
  poolQuery: (text, params) => {
    return pool.query(text, params);
  },
  getClient() {
    return pool.connect();
  },
};
