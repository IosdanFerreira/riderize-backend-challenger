# Desafio Backend Riderize

Este repositório contém a implementação da minha solução para o desafio técnico backend da Riderize, uma API para combinar pedaladas em grupo.

## Tecnologias Utilizadas

**Backend:**

- Node.js
- TypeScript
- GraphQL (Apollo Server, TypeGraphQL)
- PostgreSQL (via Prisma ORM)
- Redis (cache)
- Docker
- JWT para autenticação

---

## Funcionalidades

- Criar usuário "SignUp"
- Login com geração do token de acesso para usar nas rotas
- Criar pedais com informações completas (nome, datas, local, limite de participantes, etc)
- Listar pedais disponíveis para inscrição
- Inscrever usuários nos pedais
- Listar pedais que um usuário criou
- Listar pedais que um usuário participou
- Validação para impedir inscrição após prazo final
- Cache das consultas de listagem de pedais usando Redis
- Autenticação via JWT em todas as requisições GraphQL

---

## Como rodar o projeto

### 🔹 Requisitos

- Node.js (>= 16)
- npm (>= 8) ou Yarn
- Docker

### Passos

1. Clone o repositório:

````bash
git clone https://github.com/IosdanFerreira/riderize-backend-challenger
cd riderize-backend-challenger


2. **Configurar variáveis de ambiente:**

- Crie um arquivo `.env`
- Cole as seguintes variáveis no arquivo

```env
# Server
# App
PORT=4000
ENV=dev
JWT_SECRET=your_jwt_secret_here

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=riderize

REDIS_URL=redis
REDIS_PORT=6379

DATABASE_URL="postgresql://postgres:postgres@postgres:5432/riderize?schema=public"

````

**Rode os comando docker:**

```bash
# Construa a build e rode a aplicação
docker compose up --build
```

### Guia de uso

1.  **Acesse a aplicação:**

    Abra seu navegador e acesse `http://localhost:3000`.

---
