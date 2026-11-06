-- ATENÇÃO: limpa as tabelas e recadastra os currículos de exemplo.
TRUNCATE projeto_habilidades, habilidades, projetos, experiencias, formacoes, pessoas RESTART IDENTITY CASCADE;

INSERT INTO pessoas (id, nome, email, telefone, cidade, resumo, linkedin, github) VALUES
(1, 'Ana Souza', 'ana.souza@exemplo.com', '(81) 99999-0001', 'Recife',
 'Desenvolvedora back-end com foco em APIs REST, bancos relacionais e boas práticas de arquitetura.',
 'https://linkedin.com/in/ana-souza-exemplo', 'https://github.com/ana-souza-exemplo'),
(2, 'Bruno Lima', 'bruno.lima@exemplo.com', '(11) 98888-0002', 'São Paulo',
 'Analista de dados apaixonado por transformar dados em decisões, com experiência em BI e automação.',
 'https://linkedin.com/in/bruno-lima-exemplo', 'https://github.com/bruno-lima-exemplo');

INSERT INTO formacoes (id, pessoa_id, instituicao, curso, nivel, data_inicio, data_fim, descricao) VALUES
(1, 1, 'Universidade Federal de Pernambuco', 'Sistemas de Informação', 'Graduação', '2022-02-01', '2026-12-15', 'Ênfase em engenharia de software e banco de dados.'),
(2, 1, 'Alura', 'Formação Node.js', 'Curso livre', '2023-03-01', '2023-09-30', 'APIs REST, testes e deploy.'),
(3, 2, 'Universidade de São Paulo', 'Estatística', 'Graduação', '2019-02-01', '2023-12-10', 'Foco em análise exploratória e modelagem.'),
(4, 2, 'DataCamp', 'Data Analyst with Python', 'Curso livre', '2022-05-01', '2022-11-30', 'Pandas, visualização e SQL.');

INSERT INTO experiencias (id, pessoa_id, empresa, cargo, data_inicio, data_fim, atual, descricao) VALUES
(1, 1, 'Porto Digital Labs', 'Estagiária de Desenvolvimento Back-end', '2024-03-01', NULL, TRUE, 'Desenvolvimento e manutenção de APIs em Node.js e PostgreSQL.'),
(2, 1, 'Startup Recife Tech', 'Desenvolvedora Júnior', '2023-01-01', '2024-02-28', FALSE, 'Criação de microsserviços e integração com serviços de terceiros.'),
(3, 2, 'Banco Horizonte', 'Analista de Dados Júnior', '2024-01-15', NULL, TRUE, 'Construção de dashboards e rotinas de ETL para áreas de negócio.'),
(4, 2, 'Varejo Mais', 'Estagiário de BI', '2022-08-01', '2023-12-31', FALSE, 'Relatórios gerenciais e automação de planilhas.');

INSERT INTO projetos (id, pessoa_id, titulo, descricao, url_repositorio, data_inicio, data_fim) VALUES
(1, 1, 'API de Controle de Acesso', 'API REST para cadastro de usuários e registro de acessos.', 'https://github.com/ana-souza-exemplo/api-acesso', '2025-03-01', '2025-06-30'),
(2, 1, 'Gerenciador de Tarefas', 'Aplicação de tarefas com autenticação e containers Docker.', 'https://github.com/ana-souza-exemplo/tarefas', '2024-08-01', '2024-11-30'),
(3, 2, 'Dashboard de Vendas', 'Painel interativo de indicadores de vendas por região.', 'https://github.com/bruno-lima-exemplo/dashboard-vendas', '2024-04-01', '2024-07-31'),
(4, 2, 'Pipeline de Dados Públicos', 'ETL de dados abertos com limpeza e carga em banco relacional.', 'https://github.com/bruno-lima-exemplo/pipeline-dados', '2023-09-01', '2023-12-15');

INSERT INTO habilidades (id, pessoa_id, nome, nivel) VALUES
(1, 1, 'Node.js', 'Avançado'),
(2, 1, 'Express', 'Avançado'),
(3, 1, 'PostgreSQL', 'Intermediário'),
(4, 1, 'Docker', 'Intermediário'),
(5, 1, 'Git', 'Avançado'),
(6, 2, 'Python', 'Avançado'),
(7, 2, 'Pandas', 'Avançado'),
(8, 2, 'SQL', 'Avançado'),
(9, 2, 'Power BI', 'Intermediário'),
(10, 2, 'Git', 'Intermediário');

INSERT INTO projeto_habilidades (projeto_id, habilidade_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 4), (2, 5),
(3, 6), (3, 8), (3, 9),
(4, 6), (4, 7), (4, 8);

-- Ajusta as sequences após inserir ids explícitos
SELECT setval(pg_get_serial_sequence('pessoas', 'id'), (SELECT MAX(id) FROM pessoas));
SELECT setval(pg_get_serial_sequence('formacoes', 'id'), (SELECT MAX(id) FROM formacoes));
SELECT setval(pg_get_serial_sequence('experiencias', 'id'), (SELECT MAX(id) FROM experiencias));
SELECT setval(pg_get_serial_sequence('projetos', 'id'), (SELECT MAX(id) FROM projetos));
SELECT setval(pg_get_serial_sequence('habilidades', 'id'), (SELECT MAX(id) FROM habilidades));
