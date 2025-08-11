#!/bin/sh

# Espera o banco ficar disponível
echo "⏳ Aguardando o PostgreSQL em $DATABASE_URL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL está pronto!"

# Executa migrações
npx prisma migrate dev --name init

# Inicia o servidor
npm run start:dev
