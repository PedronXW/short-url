# ShortURL

Essa aplicação é a implementação de um encurtador de URL, ela possui sistema de autenticação, armazenamento e redirecionamento, e foi feita com o intuito de obdecer às especificações dispostas nesse arquivo: https://docs.google.com/document/d/1eZpPju0EHUO5tzGgi3J3G0dtGX8G9i6eh1FU39WYg2M/edit?tab=t.0


## Como inicializar a aplicação

Para iniciar a aplicação é necessário clonar a aplicação do repositório, entrar na pasta raiz do projeto e em seguida subir os containers docker utilizando o docker compose, com o comando "docker compose up -d" ou "docker-compose up -d", dependendo da versão que estiver utilizando. Após o comando, o container vai ser inicializado e então o processo de configuração do banco de dados, assim como a inicialização da aplicação acontecerá.

## Documentação de Endpoints

A documentação de endpoints foi feita utilizando a ferramente Swagger e pode ser encontrada ao iniciar a aplicação com o link: http://localhost:3333/v1/docs#/ se estiver com a aplicação rodando localmente

## Variáveis de Ambiente

Todas as variáveis de ambiente estão descritas no arquivo docker-compose.yaml e os valores disponíveis no repositório são valores randômicos e podem ser substituidos para a utilização da aplicação.

## Testes

Os testes são escritos utilizando o framework Jest, ele é utilizado em todos os tipos de teste e facilita o processo de gerenciamento dos ambientes além da própria execução, e a biblioteca Supertest, utilizada para simular as requisições nos endpoints necessários para a execução do teste.

Os testes unitários estão presentes, principalmente, dentro do domínio da aplicação, na parte de Services, e podem ser identificados ao analizar o nome dos arquivos, eles possuem final ".unit.spec.ts". Todos os testes unítarios utilizam de repositórios em memória para executar suas verificações, esses repositórios podem ser encontrados dentro da pasta "test", na raiz da aplicação.

Já os testes E2E podem ser encontrados na parte de infra da aplicação, junto com os controllers dos endpoints que eles estão testando. Estes testes funcionam simulando interações reais do usuário, assim, no ínicio dos testes é gerado um novo banco para que os dados sejam armazenados nele e este mesmo banco é apagado após cada um dos testes, criando um ambiente único e sem interferencias para cada teste.

Para realizar os testes é necessário entrar no container com o comando "docker compose exec short-url sh" e em seguinda realizar os testes com o comando "npm run test" para fazer todos os testes ou somente "npm run test:unit" para rodar os testes unitários.
