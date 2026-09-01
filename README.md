# HR Management System

A full-stack HR Management web application built with React, Node.js, Express, PostgreSQL, and Prisma.

## Project documentation

- [Implementation plan](docs/implementation/README.md) — ordered gates, acceptance criteria, and the next work to implement.
- [Gate 0A execution guide](docs/implementation/how-to-execute-gate-0a.md) — safe step-by-step database, build, login, and authorization baseline.
- [Full gstack project review](docs/reviews/2026-08-29-staging-project-autoplan.md) — CEO, design, engineering, DX, risk, and requirements findings.

> Current status: the review is complete, but the present `staging` tree is not cleared for UAT or production. Start with Gate 0A before using the remaining quick-start instructions below.

## 🚀 Features

- **Authentication** — JWT-based login with role-based access control (RBAC)
- **Dashboard** — Role-specific overview with key metrics and quick actions
- **Employee Management** — Full CRUD for employee profiles with search, filter, and pagination
- **Department Management** — Create and manage departments with employee rosters
- **Attendance Tracking** — Daily clock-in/clock-out with monthly summaries
- **Leave Management** — Apply for leave, approval workflows, balance tracking

## 🔐 User Roles

| Role | Access |
|------|--------|
| **ADMIN** | Full access to all modules and settings |
| **HR** | Manage employees, departments, approve leaves |
| **MANAGER** | View team, approve leaves, view attendance |
| **EMPLOYEE** | Self-service: attendance, leave applications, profile |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT tokens with bcrypt password hashing

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm or yarn

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd hr-management-app

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Database Setup

**Option A: Using Docker (Recommended)**
```bash
# From project root
docker-compose up -d
```

**Option B: Local PostgreSQL**
- Create a database named `hr_management`
- Update `server/.env` with your connection string

### 3. Configure Environment

```bash
# Copy and edit environment variables
cp .env.example server/.env
# Edit server/.env with your database URL and JWT secret
```

### 4. Initialize Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### 5. Start Development

```bash
# From project root - starts both server and client
npm run dev

# Or start individually:
cd server && npm run dev    # Backend at http://localhost:5000
cd client && npm run dev    # Frontend at http://localhost:5173
```

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hrms.com | password123 |
| HR | priya.sharma@hrms.com | password123 |
| Manager | rahul.verma@hrms.com | password123 |
| Employee | ananya.patel@hrms.com | password123 |

## 📁 Project Structure

```
hr-management-app/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── api/             # API client and hooks
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route definitions
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Utilities
│   └── ...
├── server/                  # Node.js Backend
│   ├── prisma/              # Database schema & seeds
│   ├── src/
│   │   ├── config/          # App configuration
│   │   ├── middleware/      # Auth, RBAC, validation
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/
│   │   │   ├── employees/
│   │   │   ├── departments/
│   │   │   ├── attendance/
│   │   │   └── leave/
│   │   └── utils/           # Helper utilities
│   └── ...
├── docker-compose.yml       # PostgreSQL + pgAdmin
└── README.md
```

## 🗄️ API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/login | User login | Public |
| GET | /api/auth/me | Get current user | Authenticated |
| GET | /api/employees | List employees | Authenticated |
| POST | /api/employees | Create employee | Admin, HR |
| PUT | /api/employees/:id | Update employee | Admin, HR |
| DELETE | /api/employees/:id | Delete employee | Admin, HR |
| GET | /api/departments | List departments | Authenticated |
| POST | /api/departments | Create department | Admin, HR |
| POST | /api/attendance/clock-in | Clock in | Authenticated |
| POST | /api/attendance/clock-out | Clock out | Authenticated |
| POST | /api/leaves/apply | Apply for leave | Authenticated |
| PATCH | /api/leaves/:id/status | Approve/reject leave | Admin, HR, Manager |

## 📜 License

MIT
