import json

def req(name, method, path, body=None, tests=None):
    query = []
    p = path
    if '?' in path:
        p, qs = path.split('?', 1)
        query = [dict(zip(('key', 'value'), kv.split('=', 1))) for kv in qs.split('&')]
    url = {"raw": "{{baseUrl}}" + path, "host": ["{{baseUrl}}"],
           "path": [s for s in p.strip('/').split('/') if s]}
    if query:
        url["query"] = query
    r = {"method": method, "header": [], "url": url}
    if body is not None:
        r["header"] = [{"key": "Content-Type", "value": "application/json"}]
        r["body"] = {"mode": "raw", "raw": json.dumps(body, indent=2, ensure_ascii=False),
                     "options": {"raw": {"language": "json"}}}
    item = {"name": name, "request": r}
    if tests:
        item["event"] = [{"listen": "test", "script": {"type": "text/javascript", "exec": tests}}]
    return item

def status_test(code, var=None):
    t = [f"pm.test('Status {code}', () => pm.response.to.have.status({code}));"]
    if var:
        t += ["const j = pm.response.json();", f"pm.collectionVariables.set('{var}', j.id);"]
    return t

def folder(name, items):
    return {"name": name, "item": items}

def crud_folder(titulo, path, idvar, create, update):
    return folder(titulo, [
        req(f"Listar {titulo}", "GET", f"/{path}", tests=status_test(200)),
        req(f"Buscar {titulo} por ID", "GET", f"/{path}/{{{{{idvar}}}}}", tests=status_test(200)),
        req(f"Criar ({titulo})", "POST", f"/{path}", create, status_test(201, idvar)),
        req(f"Atualizar ({titulo})", "PUT", f"/{path}/{{{{{idvar}}}}}", update, status_test(200)),
        req(f"Remover ({titulo})", "DELETE", f"/{path}/{{{{{idvar}}}}}", tests=status_test(200)),
    ])

pid = "{{pessoaId}}"
items = [
    crud_folder("Pessoas", "pessoas", "pessoaId",
        {"nome": "Pessoa de Teste", "email": "teste{{$timestamp}}@exemplo.com", "telefone": "(81) 90000-0000",
         "cidade": "Olinda", "resumo": "Currículo criado pelo Postman.",
         "linkedin": "https://linkedin.com/in/teste", "github": "https://github.com/teste"},
        {"cidade": "Recife", "resumo": "Resumo atualizado pelo Postman."}),
    crud_folder("Formacoes", "formacoes", "formacaoId",
        {"pessoa_id": pid, "instituicao": "Instituição Teste", "curso": "Curso Teste", "nivel": "Graduação",
         "data_inicio": "2022-02-01", "data_fim": "2026-12-15", "descricao": "Formação criada pelo Postman."},
        {"curso": "Curso Teste (atualizado)"}),
    crud_folder("Experiencias", "experiencias", "experienciaId",
        {"pessoa_id": pid, "empresa": "Empresa Teste", "cargo": "Desenvolvedor", "data_inicio": "2024-01-01",
         "atual": True, "descricao": "Experiência criada pelo Postman."},
        {"cargo": "Desenvolvedor Pleno", "atual": False, "data_fim": "2025-01-01"}),
    crud_folder("Projetos", "projetos", "projetoId",
        {"pessoa_id": pid, "titulo": "Projeto Teste", "descricao": "Projeto criado pelo Postman.",
         "url_repositorio": "https://github.com/teste/projeto", "data_inicio": "2025-01-01"},
        {"titulo": "Projeto Teste (atualizado)"}),
    crud_folder("Habilidades", "habilidades", "habilidadeId",
        {"pessoa_id": pid, "nome": "Node.js", "nivel": "Intermediário"},
        {"nivel": "Avançado"}),
]

rel = folder("Relacionamentos", [
    req("Currículo completo da pessoa", "GET", "/pessoas/{{pessoaId}}/curriculo", tests=status_test(200)),
    req("Formações da pessoa", "GET", "/pessoas/{{pessoaId}}/formacoes", tests=status_test(200)),
    req("Experiências da pessoa", "GET", "/pessoas/{{pessoaId}}/experiencias", tests=status_test(200)),
    req("Projetos da pessoa", "GET", "/pessoas/{{pessoaId}}/projetos", tests=status_test(200)),
    req("Habilidades da pessoa", "GET", "/pessoas/{{pessoaId}}/habilidades", tests=status_test(200)),
    req("Filtrar projetos por pessoa (query)", "GET", "/projetos?pessoa_id={{pessoaId}}", tests=status_test(200)),
    req("Vincular habilidade ao projeto (N:N)", "POST", "/projetos/{{projetoId}}/habilidades",
        {"habilidade_id": "{{habilidadeId}}"}, status_test(201)),
    req("Habilidades do projeto", "GET", "/projetos/{{projetoId}}/habilidades", tests=status_test(200)),
    req("Projetos que usam a habilidade", "GET", "/habilidades/{{habilidadeId}}/projetos", tests=status_test(200)),
    req("Desvincular habilidade do projeto", "DELETE", "/projetos/{{projetoId}}/habilidades/{{habilidadeId}}",
        tests=status_test(200)),
])
items.insert(0, rel)

col = {
    "info": {"name": "API Currículo (Express + Neon + Vercel)",
             "description": "Altere baseUrl e os IDs em Variables. Os requests de criação salvam o ID automaticamente.",
             "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"},
    "variable": [
        {"key": "baseUrl", "value": "https://SEU-PROJETO.vercel.app"},
        {"key": "pessoaId", "value": "1"},
        {"key": "formacaoId", "value": "1"},
        {"key": "experienciaId", "value": "1"},
        {"key": "projetoId", "value": "1"},
        {"key": "habilidadeId", "value": "1"},
    ],
    "item": items,
}
with open("postman/curriculo-api.postman_collection.json", "w", encoding="utf-8") as f:
    json.dump(col, f, indent=2, ensure_ascii=False)
print("OK")
