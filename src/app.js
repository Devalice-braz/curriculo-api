const express = require('express');
const cors = require('cors');
const entities = require('./entities');
const { crud } = require('./routes/crud');
const relations = require('./routes/relations');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    api: 'API de Currículo',
    rotas: [
      ...Object.keys(entities).map((e) => `/${e}`),
      '/pessoas/:id/curriculo',
      '/pessoas/:id/{formacoes|experiencias|projetos|habilidades}',
      '/projetos/:id/habilidades',
      '/habilidades/:id/projetos',
    ],
  });
});

// Relacionamentos primeiro, depois CRUD genérico de cada entidade
app.use('/', relations);
for (const [nome, cfg] of Object.entries(entities)) app.use(`/${nome}`, crud(nome, cfg));

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  const mapa = {
    '23503': [400, 'Referência inválida: registro relacionado não existe ou ainda possui dependências'],
    '23505': [409, 'Registro duplicado'],
    '23502': [400, 'Campo obrigatório ausente'],
    '23514': [400, 'Valor viola uma regra de validação'],
    '22P02': [400, 'Valor em formato inválido'],
    '22007': [400, 'Data inválida (use AAAA-MM-DD)'],
    '22008': [400, 'Data inválida (use AAAA-MM-DD)'],
    '22001': [400, 'Texto excede o tamanho máximo permitido'],
  };
  if (mapa[err.code]) return res.status(mapa[err.code][0]).json({ erro: mapa[err.code][1] });
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
