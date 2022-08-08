const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
});

const createDatabase = async () => {
  try {
    await pool.query("CREATE DATABASE lightsoff");
    console.log("Database was created");
  } catch (e) {
    console.log(e.message);
  }
};

createDatabase();

module.exports = {
  poolQuery: (text, params) => {
    return pool.query(text, params);
  },
  getClient() {
    return pool.connect();
  },
};
