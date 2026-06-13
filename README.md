# 🐞 DevBug Tracker

O **DevBug Tracker** é uma aplicação fullstack desenvolvida para auxiliar desenvolvedores no registro, organização e acompanhamento de bugs encontrados durante o desenvolvimento de projetos.

A plataforma permite criar projetos, registrar bugs, documentar mensagens de erro, trechos de código, possíveis causas e soluções, além de acompanhar métricas por meio de dashboard, relatórios e linha do tempo de atividades.

---

## 📌 Sobre o Projeto

Durante o desenvolvimento de sistemas, é comum encontrar erros recorrentes, mensagens difíceis de lembrar e soluções que acabam se perdendo com o tempo. O **DevBug Tracker** foi criado com o objetivo de centralizar essas informações em um ambiente organizado, permitindo que cada bug registrado se torne também uma fonte de consulta e aprendizado.

O sistema possui autenticação de usuários, gerenciamento de projetos, gerenciamento de bugs, painel com indicadores, relatórios com filtros, atividades recentes, área de perfil e configurações visuais da aplicação.

---

## ✨ Funcionalidades

* Cadastro e login de usuários
* Autenticação com token JWT
* Rotas protegidas no frontend
* Dashboard com métricas gerais
* CRUD completo de projetos
* CRUD completo de bugs
* Listagem geral de bugs do usuário
* Filtros e relatórios por tecnologia, status e severidade
* Gráfico de bugs criados e resolvidos
* Ranking de bugs por tecnologia
* Linha do tempo de atividades
* Perfil do usuário
* Edição de nome
* Alteração de senha
* Upload e remoção de foto de perfil
* Exclusão de conta
* Configurações da aplicação
* Personalização da cor de destaque
* Modo de densidade confortável ou compacta
* Escolha da página inicial após login

---

## 🧪 Principais Telas

* **Home**: página inicial pública com apresentação da aplicação.
* **Login**: autenticação de usuário.
* **Cadastro**: criação de nova conta.
* **Dashboard**: visão geral com métricas de projetos e bugs.
* **Projetos**: listagem, criação, edição, detalhes e exclusão de projetos.
* **Bugs**: listagem geral, criação, edição, detalhes e exclusão de bugs.
* **Relatórios**: análise dos bugs com filtros e gráficos.
* **Atividades**: linha do tempo baseada nos registros de projetos e bugs.
* **Perfil**: gerenciamento dos dados da conta.
* **Configurações**: preferências visuais e comportamentais da aplicação.

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Java
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* PostgreSQL
* Bean Validation
* Lombok
* Maven

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* CSS3
* LocalStorage

### Ferramentas

* Git
* GitHub
* Postman
* VS Code
* Spring Tool Suite

---

## 📂 Estrutura do Projeto

```bash
devbug-tracker/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/devbugtracker/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── enums/
│   │   │   │       ├── exception/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, é necessário ter instalado:

* Java 17 ou superior
* Maven
* Node.js
* PostgreSQL
* Git

---

## ⚙️ Configuração do Backend

Acesse a pasta do backend:

```bash
cd backend
```

Configure o arquivo `application.properties` com os dados do seu banco PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/devbug_tracker
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Execute o backend:

```bash
mvn spring-boot:run
```

Por padrão, a API será executada em:

```bash
http://localhost:8080
```

---

## 💻 Configuração do Frontend

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env.local` com base no `.env.example`:

```env
VITE_API_URL=http://localhost:8080
```

Execute o frontend:

```bash
npm run dev
```

Por padrão, a aplicação será executada em:

```bash
http://localhost:5173
```

---

## 🔐 Autenticação

O sistema utiliza autenticação baseada em **JWT**. Após o login ou cadastro, o backend retorna um token, que é armazenado no `localStorage` e utilizado nas requisições autenticadas por meio de interceptors do Axios.

As rotas privadas do frontend só podem ser acessadas por usuários autenticados.

---

## 📡 Principais Endpoints

### Autenticação e Usuário

```http
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /auth/me
PUT    /auth/me/password
POST   /auth/me/profile-image
DELETE /auth/me/profile-image
DELETE /auth/me
```

### Projetos

```http
GET    /projects
GET    /projects/{id}
GET    /projects/status/{status}
GET    /projects/technologies?names=Java&names=React
POST   /projects
PUT    /projects/{id}
DELETE /projects/{id}
```

### Bugs

```http
GET    /bugs
GET    /bugs/{id}
GET    /bugs/project/{projectId}
GET    /bugs/status/{status}
GET    /bugs/severity/{severity}
GET    /bugs/technology?name=Spring Boot
POST   /bugs
PUT    /bugs/{id}
DELETE /bugs/{id}
```

### Dashboard

```http
GET /dashboard
```

---

## 🗃️ Entidades Principais

### Usuário

Representa o usuário autenticado da aplicação.

Principais dados:

* Nome
* Email
* Senha criptografada
* Foto de perfil
* Data de criação
* Data de atualização

### Projeto

Representa um projeto cadastrado pelo usuário.

Principais dados:

* Nome
* Descrição
* Tecnologias
* Status
* Data de criação
* Data de atualização

### Bug

Representa um erro ou problema registrado dentro de um projeto.

Principais dados:

* Título
* Descrição
* Mensagem de erro
* Trecho de código
* Tecnologia
* Severidade
* Status
* Possível causa
* Solução
* Data de criação
* Data de atualização
* Data de resolução

---

## 📊 Relatórios

A tela de relatórios permite analisar os dados cadastrados no sistema com filtros por:

* Tecnologia
* Status do projeto
* Status do bug
* Severidade do bug

Além disso, a página apresenta:

* Total de projetos filtrados
* Total de bugs filtrados
* Bugs abertos
* Bugs resolvidos
* Bugs críticos
* Gráfico de bugs criados e resolvidos por mês
* Ranking de bugs por tecnologia
* Resumo interpretativo do recorte atual

---

## 🕒 Atividades

A tela de atividades apresenta uma linha do tempo construída a partir dos dados existentes no sistema, exibindo eventos como:

* Projeto criado
* Projeto atualizado
* Bug registrado
* Bug atualizado
* Bug resolvido

Essa área permite acompanhar a evolução dos registros de forma cronológica.

---

## 🎨 Configurações da Aplicação

A aplicação possui configurações visuais salvas localmente no navegador, incluindo:

* Cor de destaque da interface
* Densidade da interface
* Página inicial após login

As configurações são aplicadas apenas nas páginas autenticadas, mantendo as páginas públicas com o visual padrão da aplicação.

---

## 🚧 Limitações e Melhorias Futuras

A funcionalidade de recuperação de senha por email ainda não foi implementada nesta versão. Atualmente, o sistema permite cadastro, login, alteração de senha pelo perfil do usuário autenticado e gerenciamento completo da conta, mas não possui fluxo de redefinição de senha para usuários deslogados.

Como melhoria futura, pretende-se implementar um fluxo de recuperação com envio de email, geração de token temporário e tela para redefinição segura da senha.

Outras melhorias futuras incluem:

* Exportação de relatórios
* Filtros por período
* Histórico real de atividades salvo no backend
* Notificações
* Testes automatizados
* Deploy da aplicação
* Recuperação de senha por email
* Paginação nas listagens
* Busca textual por projetos e bugs

---

## 📷 Capturas de Tela (prints)
Os prints disponíveis em `docs/images/` mostram as telas principais da aplicação e exemplos de uso. Abaixo há uma lista dos arquivos encontrados e uma breve descrição de cada um:

- `docs/images/home.png`: Tela inicial pública (Home) com apresentação da aplicação.
- `docs/images/login.png`: Tela de login do usuário.
- `docs/images/cadastro.png`: Tela de cadastro/registro de novo usuário.
- `docs/images/dashboard.png`: Dashboard com métricas gerais, gráficos e indicadores.
- `docs/images/projetos.png`: Listagem de projetos do usuário.
- `docs/images/projeto-detalhes.png`: Página de detalhes de um projeto específico.
- `docs/images/bugs.png`: Listagem geral de bugs.
- `docs/images/bug-detalhes.png`: Página de detalhes de um bug, incluindo mensagem de erro e solução.
- `docs/images/atividades.png`: Linha do tempo de atividades mostrando eventos recentes.
- `docs/images/perfil.png`: Página de perfil do usuário com edição de dados e foto.
- `docs/images/configuracoes.png`: Tela de configurações (tema, densidade, página inicial).
- `docs/images/relatorio.png`: Tela de relatórios com filtros e gráficos.

---

## 📌 Status do Projeto

Projeto em desenvolvimento avançado, com as principais funcionalidades implementadas e integradas entre frontend e backend.

---

## 👩‍💻 Desenvolvido por

Projeto desenvolvido por **gdev-13** como aplicação fullstack para estudo, portfólio e relatório de estágio supervisionado.
