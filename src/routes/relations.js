const express = require('express');
const pool = require('../db');
const { wrap } = require('./crud');

const router = express.Router();

async function pessoaExiste(id) {
  const { rows } = await pool.query('SELECT * FROM pessoas WHERE id = $1', [id]);
  return rows[0];
}

// Currículo completo: pessoa + formações + experiências + projetos (com habilidades) + habilidades
router.get('/pessoas/:id/curriculo', wrap(async (req, res) => {
  const pessoa = await pessoaExiste(req.params.id);
  if (!pessoa) return res.status(404).json({ erro: 'Pessoa não encontrada' });

  const q = (t) => pool.query(`SELECT * FROM ${t} WHERE pessoa_id = $1 ORDER BY id`, [pessoa.id]);
  const [formacoes, experiencias, projetos, habilidades, vinculos] = await Promise.all([
    q('formacoes'),
    q('experiencias'),
    q('projetos'),
    q('habilidades'),
    pool.query(
      `SELECT ph.projeto_id, h.id, h.nome, h.nivel
         FROM projeto_habilidades ph
         JOIN habilidades h ON h.id = ph.habilidade_id
         JOIN projetos p ON p.id = ph.projeto_id
        WHERE p.pessoa_id = $1
        ORDER BY h.id`,
      [pessoa.id]
    ),
  ]);

  const projetosComHabilidades = projetos.rows.map((p) => ({
    ...p,
    habilidades: vinculos.rows
      .filter((v) => v.projeto_id === p.id)
      .map(({ id, nome, nivel }) => ({ id, nome, nivel })),
  }));

  res.json({
    ...pessoa,
    formacoes: formacoes.rows,
    experiencias: experiencias.rows,
    projetos: projetosComHabilidades,
    habilidades: habilidades.rows,
  });
}));

// Relacionamento 1:N — itens de uma pessoa
for (const tabela of ['formacoes', 'experiencias', 'projetos', 'habilidades']) {
  router.get(`/pessoas/:id/${tabela}`, wrap(async (req, res) => {
    if (!(await pessoaExiste(req.params.id))) return res.status(404).json({ erro: 'Pessoa não encontrada' });
    const { rows } = await pool.query(`SELECT * FROM ${tabela} WHERE pessoa_id = $1 ORDER BY id`, [req.params.id]);
    res.json(rows);
  }));
}

// Relacionamento N:N — projetos <-> habilidades
router.get('/projetos/:id/habilidades', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT h.* FROM habilidades h
       JOIN projeto_habilidades ph ON ph.habilidade_id = h.id
      WHERE ph.projeto_id = $1 ORDER BY h.id`,
    [req.params.id]
  );
  res.json(rows);
}));

router.post('/projetos/:id/habilidades', wrap(async (req, res) => {
  const habilidadeId = req.body && req.body.habilidade_id;
  if (!habilidadeId) return res.status(400).json({ erro: 'Campo obrigatório ausente', campos: ['habilidade_id'] });

  const { rows } = await pool.query(
    `SELECT p.pessoa_id AS pessoa_projeto, h.pessoa_id AS pessoa_habilidade
       FROM projetos p, habilidades h WHERE p.id = $1 AND h.id = $2`,
    [req.params.id, habilidadeId]
  );
  if (!rows.length) return res.status(404).json({ erro: 'Projeto ou habilidade não encontrado' });
  if (rows[0].pessoa_projeto !== rows[0].pessoa_habilidade) {
    return res.status(400).json({ erro: 'Projeto e habilidade pertencem a pessoas diferentes' });
  }

  const ins = await pool.query(
    'INSERT INTO projeto_habilidades (projeto_id, habilidade_id) VALUES ($1, $2) RETURNING *',
    [req.params.id, habilidadeId]
  );
  res.status(201).json(ins.rows[0]);
}));

router.delete('/projetos/:id/habilidades/:habilidadeId', wrap(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM projeto_habilidades WHERE projeto_id = $1 AND habilidade_id = $2',
    [req.params.id, req.params.habilidadeId]
  );
  if (!rowCount) return res.status(404).json({ erro: 'Vínculo não encontrado' });
  res.json({ mensagem: 'Vínculo removido com sucesso' });
}));

router.get('/habilidades/:id/projetos', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.* FROM projetos p
       JOIN projeto_habilidades ph ON ph.projeto_id = p.id
      WHERE ph.habilidade_id = $1 ORDER BY p.id`,
    [req.params.id]
  );
  res.json(rows);
}));

module.exports = router;
