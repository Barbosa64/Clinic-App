📌 Overview
Clinic App is a full‑stack application designed to manage clinical operations such as patient records, appointments, authentication, and administrative workflows.
The project includes:

A backend (Node.js + Express + Prisma + PostgreSQL)

A frontend (modern JavaScript/TypeScript stack)

A Docker‑based database environment

A Vercel deployment for the backend

This repository is structured for developers who want to run, extend, or contribute to the project.

⭐ Key Features
User Authentication & Authorization (JWT‑based)

PostgreSQL Database with Prisma ORM

Docker‑managed database environment

Modular Backend Architecture

Frontend App for interacting with the API

Environment‑based configuration

Production‑ready deployment setup

📁 Project Structure
Código
Clinic-App/
│
├── backend/          # Node.js + Express + Prisma API
│   ├── prisma/       # Schema, migrations
│   ├── src/          # Controllers, routes, services
│   ├── .env.example
│   └── package.json
│
├── frontend/         # Frontend application Vite/React
│   ├── src/
│   └── package.json
│
├── docker-compose.yml
├── LICENSE
└── README.md

🚀 Getting Started
Prerequisites
Node.js  v18+

Docker Desktop

npm (bundled with Node)


🛠️ Installation & Setup
1. Clone the repository
bash
git clone https://github.com/Barbosa64/Clinic-App.git
cd Clinic-App


2. Start the PostgreSQL database (Docker)
From the project root:

bash
docker-compose up -d


3. Backend Setup
bash
cd backend
npm install


Run Prisma migrations
bash
npx prisma migrate dev --name init

4. Frontend Setup
bash
cd ../frontend
npm install
npm run dev


📚 Documentation & Help


Deployment (backend):
https://clinic-app-eta-ten.vercel.app/ (clinic-app-eta-ten.vercel.app in Bing)
