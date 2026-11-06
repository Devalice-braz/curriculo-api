require('dotenv').config();
const { Pool, types } = require('pg');
types.setTypeParser(1082, (v) => v); // datas (DATE) como texto AAAA-MM-DD

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
});

module.exports = pool;
