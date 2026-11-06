CREATE TABLE IF NOT EXISTS pessoas (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(120) NOT NULL,
  email     VARCHAR(160) NOT NULL UNIQUE,
  telefone  VARCHAR(30),
  cidade    VARCHAR(80),
  resumo    TEXT,
  linkedin  VARCHAR(200),
  github    VARCHAR(200),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS formacoes (
  id          SERIAL PRIMARY KEY,
  pessoa_id   INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  instituicao VARCHAR(160) NOT NULL,
  curso       VARCHAR(160) NOT NULL,
  nivel       VARCHAR(60),
  data_inicio DATE,
  data_fim    DATE,
  descricao   TEXT
);

CREATE TABLE IF NOT EXISTS experiencias (
  id          SERIAL PRIMARY KEY,
  pessoa_id   INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  empresa     VARCHAR(160) NOT NULL,
  cargo       VARCHAR(120) NOT NULL,
  data_inicio DATE,
  data_fim    DATE,
  atual       BOOLEAN NOT NULL DEFAULT FALSE,
  descricao   TEXT
);

CREATE TABLE IF NOT EXISTS projetos (
  id              SERIAL PRIMARY KEY,
  pessoa_id       INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  titulo          VARCHAR(160) NOT NULL,
  descricao       TEXT,
  url_repositorio VARCHAR(255),
  data_inicio     DATE,
  data_fim        DATE
);

CREATE TABLE IF NOT EXISTS habilidades (
  id        SERIAL PRIMARY KEY,
  pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  nome      VARCHAR(80) NOT NULL,
  nivel     VARCHAR(30)
);

-- Relacionamento N:N: tecnologias/habilidades usadas em cada projeto
CREATE TABLE IF NOT EXISTS projeto_habilidades (
  projeto_id    INTEGER NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  habilidade_id INTEGER NOT NULL REFERENCES habilidades(id) ON DELETE CASCADE,
  PRIMARY KEY (projeto_id, habilidade_id)
);
