const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

(async () => {
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não definida. Crie o arquivo .env.');
    for (const arquivo of ['schema.sql', 'seed.sql']) {
      const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', arquivo), 'utf8');
      await pool.query(sql);
      console.log(`✔ ${arquivo} executado`);
    }
    const { rows } = await pool.query('SELECT id, nome FROM pessoas ORDER BY id');
    console.log('Pessoas cadastradas:', rows);
  } catch (e) {
    console.error('Erro no setup:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
