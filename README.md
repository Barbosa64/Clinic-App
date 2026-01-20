# Clinic App

## 📌 Overview

Clinic App is a full‑stack application designed to manage clinical operations such as patient records, appointments, authentication, and administrative workflows.

The project includes:

- **Backend** (Node.js + Express + Prisma + PostgreSQL)
- **Frontend** (JavaScript/TypeScript stack)
- **Docker‑based database environment**
- **Backend deployment on Vercel**

---

## ⭐ Key Features

- JWT‑based authentication and authorization  
- PostgreSQL database managed with Prisma ORM  
- Docker‑managed database environment  
- Modular backend architecture  
- Frontend application for interacting with the API  
- Environment‑based configuration  
- Production‑ready deployment setup  

---

```

## 📁 Project Structure

Clinic-App/
│
├── backend/                 # Node.js  + Express + Prisma API
│   ├── prisma/              # Schema, migrations
│   ├── src/                 # Controllers, routes, services
│   ├── .env.example
│   └── package.json
│
├── frontend/                # Frontend application (Vite/React)
│   ├── src/
│   └── package.json
│
├── docker-compose.yml
├── LICENSE
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+  
- Docker Desktop  
- npm (bundled with Node)

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```
git clone https://github.com/Barbosa64/Clinic-App.git
cd Clinic-App
```
### 2. Start PostgreSQL (Docker)
```
docker-compose up -d
```
### 3. Backend Setup
```
cd backend
```
```
npm install
```

#### Create the environment file:
```
cp .env.example .env
```
#### Run Prisma migrations:
```
npx prisma migrate dev --name init
```
#### Start the backend server:
```
npm run dev
```

### 4. Frontend Setup
```
cd ../frontend
```
```
npm install
```
```
npm run dev
```

## 📚 Documentation & Help
Backend deployment:
https://clinic-app-eta-ten.vercel.app/
