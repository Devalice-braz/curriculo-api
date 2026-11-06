// Definição das entidades com CRUD genérico.
// "filterBy" permite filtrar a listagem via query string (ex.: /projetos?pessoa_id=1).
module.exports = {
  pessoas: {
    fields: ['nome', 'email', 'telefone', 'cidade', 'resumo', 'linkedin', 'github'],
    required: ['nome', 'email'],
    filterBy: ['cidade'],
  },
  formacoes: {
    fields: ['pessoa_id', 'instituicao', 'curso', 'nivel', 'data_inicio', 'data_fim', 'descricao'],
    required: ['pessoa_id', 'instituicao', 'curso'],
    filterBy: ['pessoa_id'],
  },
  experiencias: {
    fields: ['pessoa_id', 'empresa', 'cargo', 'data_inicio', 'data_fim', 'atual', 'descricao'],
    required: ['pessoa_id', 'empresa', 'cargo'],
    filterBy: ['pessoa_id'],
  },
  projetos: {
    fields: ['pessoa_id', 'titulo', 'descricao', 'url_repositorio', 'data_inicio', 'data_fim'],
    required: ['pessoa_id', 'titulo'],
    filterBy: ['pessoa_id'],
  },
  habilidades: {
    fields: ['pessoa_id', 'nome', 'nivel'],
    required: ['pessoa_id', 'nome'],
    filterBy: ['pessoa_id'],
  },
};
