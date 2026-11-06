# API de Currículo — Express + PostgreSQL (NeonDB) + Vercel

API REST com CRUD completo de `pessoas`, `formacoes`, `experiencias`, `projetos` e `habilidades`.

## Relacionamentos
- 1:N — `pessoas` → formacoes, experiencias, projetos, habilidades (`ON DELETE CASCADE`)
- N:N — `projetos` ↔ `habilidades` (tabela `projeto_habilidades`)

## Rotas
| Método | Rota | Descrição |
|---|---|---|
| GET/POST | `/pessoas`, `/formacoes`, `/experiencias`, `/projetos`, `/habilidades` | Listar / criar |
| GET/PUT/DELETE | `/{entidade}/:id` | Buscar / atualizar / remover |
| GET | `/pessoas/:id/curriculo` | Currículo completo |
| GET | `/pessoas/:id/{formacoes,experiencias,projetos,habilidades}` | Itens da pessoa |
| GET/POST | `/projetos/:id/habilidades` | Listar / vincular (`{"habilidade_id": 1}`) |
| DELETE | `/projetos/:id/habilidades/:habilidadeId` | Desvincular |
| GET | `/habilidades/:id/projetos` | Projetos que usam a habilidade |

Filtro por query: `/projetos?pessoa_id=1` (vale para formacoes, experiencias e habilidades).

## Rodar local
```bash
npm install
cp .env.example .env   # preencha DATABASE_URL com a string do Neon
npm run db:setup       # cria tabelas e cadastra 2 currículos (apaga dados existentes)
npm run dev
```

## Deploy
Vercel → variável de ambiente `DATABASE_URL`. Depois do deploy, ajuste `baseUrl` na coleção do Postman (`postman/curriculo-api.postman_collection.json`).
