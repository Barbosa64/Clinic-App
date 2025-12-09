# Instalação e Configuração

Pré-requisitos
Node.js (v18+)
Docker Desktop (Recomendado para a Base de Dados)

1. Clonar o Repositório
   code
   Bash
   git clone https://github.com/teu-utilizador/clinic-management-pern.git
   cd clinic-management-pern
   
3. Configurar a Base de Dados (Docker)
   Utilizamos o Docker para subir uma instância limpa do PostgreSQL.
   code
   Bash

# Na raiz do projeto

docker-compose up -d 

3. Configurar o Backend
code
Bash
cd backend

# Instalar dependências

npm install

# Configurar variáveis de ambiente

cp .env.example .env

# Correr migrações do Prisma (Cria as tabelas na DB do Docker)

npx prisma migrate dev --name init

# Iniciar o servidor em modo de desenvolvimento

npm run dev
Exemplo de .env:
code
Env
DATABASE_URL="postgresql://user:password@localhost:5432/clinic_db?schema=public"
JWT_SECRET="chave_secreta_segura"
PORT=3001 

4. Configurar o Frontend
code
Bash

# Noutro terminal, a partir da raiz

cd frontend

# Instalar dependências

npm install

# Iniciar a aplicação

npm run dev
Aceder via browser: http://localhost:5173
