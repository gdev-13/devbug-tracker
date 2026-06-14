# 🐞 DevBug Tracker

O **DevBug Tracker** é uma aplicação fullstack desenvolvida para auxiliar desenvolvedores no registro, organização e acompanhamento de bugs encontrados durante o desenvolvimento de projetos.

A plataforma permite criar projetos, registrar bugs, documentar mensagens de erro, trechos de código, possíveis causas e soluções, além de acompanhar métricas por meio de dashboard, relatórios e linha do tempo de atividades.

---

## 📌 Sobre o Projeto

Durante o desenvolvimento de sistemas, é comum encontrar erros recorrentes, mensagens difíceis de lembrar e soluções que acabam se perdendo com o tempo. O **DevBug Tracker** foi criado com o objetivo de centralizar essas informações em um ambiente organizado, permitindo que cada bug registrado se torne também uma fonte de consulta e aprendizado.

O sistema possui autenticação de usuários, confirmação de email, recuperação de senha, gerenciamento de projetos, gerenciamento de bugs, painel com indicadores, relatórios com filtros, atividades recentes, área de perfil e configurações visuais da aplicação.

---

## ✨ Funcionalidades

* Cadastro de usuários com validação de email
* Confirmação de email por link enviado automaticamente
* Login de usuários
* Bloqueio de login para contas ainda não confirmadas
* Recuperação de senha por email
* Redefinição de senha com token temporário
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
* Tratamento de erros com mensagens personalizadas

---

## 🧪 Principais Telas

* **Home**: página inicial pública com apresentação da aplicação.
* **Login**: autenticação de usuário.
* **Cadastro**: criação de nova conta com envio de email de confirmação.
* **Verificação de email**: tela de confirmação da conta por token.
* **Recuperação de senha**: solicitação de link para redefinição de senha.
* **Redefinição de senha**: criação de uma nova senha a partir de um token temporário.
* **Dashboard**: visão geral com métricas de projetos e bugs.
* **Projetos**: listagem, criação, edição, detalhes e exclusão de projetos.
* **Bugs**: listagem geral, criação, edição, detalhes e exclusão de bugs.
* **Relatórios**: análise dos bugs com filtros e gráficos.
* **Atividades**: linha do tempo baseada nos registros de projetos e bugs.
* **Perfil**: gerenciamento dos dados da conta.
* **Configurações**: preferências visuais e comportamentais da aplicação.

---

## 🔗 Links do Projeto

* **Frontend Web**: `https://devbug-tracker-two.vercel.app/`
* **Backend/API**: `https://devbug-tracker-api.onrender.com`
* **Repositório**: `https://github.com/gdev-13/devbug-tracker`

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
* Spring Mail
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

### Aplicação Desktop

* Tauri
* Rust

### Deploy e Serviços Externos

* Vercel
* Render
* Neon
* Brevo SMTP

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
│   ├── Dockerfile
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
│   ├── src-tauri/
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

Para gerar a versão desktop com Tauri, também é necessário ter o ambiente do Rust configurado.

---

## ⚙️ Configuração do Backend

Acesse a pasta do backend:

```bash
cd backend
```

Configure as variáveis de ambiente necessárias para o backend:

```env
DB_URL=jdbc:postgresql://localhost:5432/devbug_tracker
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta

BREVO_SMTP_LOGIN=seu_login_smtp_brevo
BREVO_SMTP_KEY=sua_chave_smtp_brevo
BREVO_FROM=DevBug Tracker <seu_email@dominio.com>

APP_API_URL=http://localhost:8080
APP_FRONTEND_URL=http://localhost:5173
```

O arquivo `application.properties` utiliza essas variáveis para configurar banco de dados, autenticação JWT, envio de emails e URLs da aplicação:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

spring.mail.host=smtp-relay.brevo.com
spring.mail.port=2525
spring.mail.username=${BREVO_SMTP_LOGIN}
spring.mail.password=${BREVO_SMTP_KEY}

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.connectiontimeout=10000
spring.mail.properties.mail.smtp.timeout=10000
spring.mail.properties.mail.smtp.writetimeout=10000

app.mail.from=${BREVO_FROM}
app.api.url=${APP_API_URL}
app.frontend.url=${APP_FRONTEND_URL}

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

## 🌐 Executando a Versão Web Publicada

O frontend da aplicação pode ser hospedado na **Vercel**, enquanto o backend permanece publicado no **Render** e conectado ao banco de dados no **Neon**.

No frontend, configure a variável de ambiente:

```env
VITE_API_URL=https://devbug-tracker-api.onrender.com
```

Na Vercel, as configurações principais do projeto são:

```txt
Framework Preset: Vite
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Também foi adicionado um arquivo `vercel.json` para permitir o funcionamento correto das rotas internas do React Router:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

No backend, a URL do frontend publicado deve ser configurada em:

```env
APP_FRONTEND_URL=https://sua-url-da-vercel.vercel.app
```

Essa variável é utilizada nos links enviados por email, como confirmação de conta e recuperação de senha.

---

## 🖥️ Executando como Aplicação Desktop

O projeto também possui configuração com **Tauri**, permitindo gerar uma versão desktop da aplicação.

Para executar em modo desenvolvimento:

```bash
cd frontend
npm run tauri dev
```

Para gerar o instalador:

```bash
cd frontend
rm -rf dist
rm -rf src-tauri/target
npm run build
npm run tauri build
```

Após o build, os instaladores ficam dentro de:

```bash
frontend/src-tauri/target/release/bundle/
```

No Windows, o instalador pode ser encontrado nas pastas:

```bash
frontend/src-tauri/target/release/bundle/nsis/
frontend/src-tauri/target/release/bundle/msi/
```

A versão desktop utiliza a mesma API publicada no Render, desde que o frontend esteja configurado com:

```env
VITE_API_URL=https://devbug-tracker-api.onrender.com
```

---

## 🚧 Limitações e Melhorias Futuras

Apesar das principais funcionalidades já estarem implementadas, algumas melhorias podem ser adicionadas futuramente, como:

* Exportação de relatórios
* Filtros por período
* Histórico real de atividades salvo no backend
* Notificações
* Testes automatizados
* Paginação nas listagens
* Busca textual por projetos e bugs
* Melhorias no layout dos emails automáticos
* Hospedagem do frontend em ambiente com HTTPS
* Integração completa entre versão web hospedada e versão desktop

---

## 📌 Status do Projeto

Projeto em desenvolvimento avançado e já publicado, com frontend web hospedado na Vercel, backend publicado no Render, banco de dados em nuvem com Neon, envio de emails com Brevo SMTP e versão desktop gerada com Tauri.


## 🔐 Autenticação e Segurança

O sistema utiliza autenticação baseada em **JWT**. Após o login, o backend retorna um token, que é armazenado no `localStorage` e utilizado nas requisições autenticadas por meio de interceptors do Axios.

As rotas privadas do frontend só podem ser acessadas por usuários autenticados.

Além do JWT, o sistema possui fluxos baseados em tokens temporários para:

* Confirmação de email;
* Recuperação de senha.

No cadastro, o usuário não recebe acesso imediato à aplicação. Após criar a conta, um email de confirmação é enviado para o endereço informado. O login só é liberado depois que o email é confirmado pelo link recebido.

Na recuperação de senha, o usuário informa o email cadastrado e recebe um link temporário para redefinir a senha. O token possui prazo de expiração e só pode ser utilizado uma vez.

---

## 📡 Principais Endpoints

### Autenticação, Email e Usuário

```http
POST   /auth/register
POST   /auth/login
GET    /auth/verify-email
POST   /auth/forgot-password
POST   /auth/reset-password
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
* Status de confirmação do email
* Foto de perfil
* Data de criação
* Data de atualização

### Token de Verificação de Email

Representa o token temporário enviado ao usuário para confirmar a conta.

Principais dados:

* Token
* Usuário associado
* Data de expiração
* Data de utilização
* Data de criação

### Token de Recuperação de Senha

Representa o token temporário utilizado no fluxo de redefinição de senha.

Principais dados:

* Token
* Usuário associado
* Data de expiração
* Data de utilização
* Data de criação

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

## 📷 Capturas de Tela (prints)

Os prints disponíveis em `docs/images/` mostram as telas principais da aplicação e exemplos de uso. Abaixo há uma lista dos arquivos encontrados e uma breve descrição de cada um:

* `docs/images/home.png`: Tela inicial pública com apresentação da aplicação.
* `docs/images/login.png`: Tela de login do usuário.
* `docs/images/cadastro.png`: Tela de cadastro de novo usuário.
* `docs/images/verificacao-email.png`: Tela de confirmação de email.
* `docs/images/recuperacao-senha.png`: Tela de solicitação de recuperação de senha.
* `docs/images/redefinicao-senha.png`: Tela de redefinição de senha.
* `docs/images/dashboard.png`: Dashboard com métricas gerais, gráficos e indicadores.
* `docs/images/projetos.png`: Listagem de projetos do usuário.
* `docs/images/projeto-detalhes.png`: Página de detalhes de um projeto específico.
* `docs/images/bugs.png`: Listagem geral de bugs.
* `docs/images/bug-detalhes.png`: Página de detalhes de um bug, incluindo mensagem de erro e solução.
* `docs/images/atividades.png`: Linha do tempo de atividades mostrando eventos recentes.
* `docs/images/perfil.png`: Página de perfil do usuário com edição de dados e foto.
* `docs/images/configuracoes.png`: Tela de configurações.
* `docs/images/relatorio.png`: Tela de relatórios com filtros e gráficos.

---

## 📌 Status do Projeto

Projeto em desenvolvimento avançado, com as principais funcionalidades implementadas e integradas entre frontend e backend.

---

## 👩‍💻 Desenvolvido por

Projeto desenvolvido por **gdev-13** como aplicação fullstack para estudo, portfólio e relatório de estágio supervisionado.