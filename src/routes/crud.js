const express = require('express');
const pool = require('../db');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function pick(body, fields) {
  const out = {};
  for (const f of fields) if (body && body[f] !== undefined) out[f] = body[f];
  return out;
}

function crud(table, { fields, required, filterBy = [] }) {
  const router = express.Router();

  router.get('/', wrap(async (req, res) => {
    const where = [];
    const values = [];
    for (const f of filterBy) {
      if (req.query[f] !== undefined) {
        values.push(req.query[f]);
        where.push(`${f} = $${values.length}`);
      }
    }
    const sql = `SELECT * FROM ${table}${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY id`;
    const { rows } = await pool.query(sql, values);
    res.json(rows);
  }));

  router.get('/:id', wrap(async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.json(rows[0]);
  }));

  router.post('/', wrap(async (req, res) => {
    const data = pick(req.body, fields);
    const missing = required.filter((f) => data[f] === undefined || data[f] === null || data[f] === '');
    if (missing.length) return res.status(400).json({ erro: 'Campos obrigatórios ausentes', campos: missing });
    const cols = Object.keys(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const { rows } = await pool.query(
      `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      Object.values(data)
    );
    res.status(201).json(rows[0]);
  }));

  router.put('/:id', wrap(async (req, res) => {
    const data = pick(req.body, fields);
    const cols = Object.keys(data);
    if (!cols.length) return res.status(400).json({ erro: 'Nenhum campo válido enviado', camposAceitos: fields });
    const sets = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const { rows } = await pool.query(
      `UPDATE ${table} SET ${sets} WHERE id = $${cols.length + 1} RETURNING *`,
      [...Object.values(data), req.params.id]
    );
    if (!rows.length) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.json(rows[0]);
  }));

  router.delete('/:id', wrap(async (req, res) => {
    const { rows } = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.json({ mensagem: 'Registro removido com sucesso', id: rows[0].id });
  }));

  return router;
}

module.exports = { crud, wrap };
