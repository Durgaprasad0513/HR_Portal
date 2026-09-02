# HR Management System

A comprehensive, full-stack HR Management web application built with React, Node.js, Express, PostgreSQL, and Prisma. 

This system acts as a centralized HR portal, designed from the ground up with strict **Role-Based and Employee-Level Access Control** to ensure that confidential HR information is strictly protected and never exposed to unauthorized employees.

## 🚀 Key Modules & Features

- **Dashboard**: Role-specific overview with key metrics.
- **Employee Management**: Full employee directory, profile management, and automatic user account provisioning.
- **Recruitment Tracker**: Manage job requisitions, track candidates through screening, interviewing, and offering stages.
- **Asset Management**: Track company laptops and assets, issue/return workflows, and condition monitoring.
- **Performance Review**: Goal setting, manager evaluations, and continuous feedback tracking.
- **Training Management**: Schedule training sessions, manage participants, and track completion.
- **Travel & Expenses**: Manage travel requests, office expenses, and multi-tier approval workflows.
- **HR Helpdesk**: Centralized ticketing system for employee requests and queries with status tracking.
- **Policies & Documents**: Upload, categorize, and track employee acknowledgements for HR handbooks and policies.
- **Attrition Analytics**: Dynamic charts tracking 12-month rolling average employee strength and voluntary/involuntary exit metrics.
- **Notifications**: Real-time, event-driven system notifications for HR events (resignations, new hires, ticket updates).
- **Audit & Security**: Comprehensive audit logs capturing old vs. new value diffs, login history tracking, and export restrictions.

## 🛡️ Security Architecture

The most critical design principle of this application is its multi-layered security model:

1. **Dynamic Role Permissions Matrix**: Instead of hardcoded roles, Admins can dynamically toggle permissions (`View`, `Add`, `Edit`, `Delete`, `Approve`, `Export`) for any role across any module using the UI.
2. **Employee-Level Data Scoping**: Data is strictly isolated. 
   - `EMPLOYEE`s (Self Scope) can only fetch and view their own data (e.g., their own travel requests).
   - `MANAGER`s (Team Scope) can view data for themselves and their direct reports.
   - `HR/ADMIN` (Org Scope) have unrestricted visibility.
3. **Data Export Restrictions**: Bulk CSV/PDF downloads are strictly gated behind a `canExport` database permission to prevent unauthorized data exfiltration.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Zod Validation
- **Database**: PostgreSQL with Prisma ORM
- **Auth & Security**: JWT tokens (with versioning for forced session invalidation), bcrypt password hashing

## 📦 Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+ 
- npm

### 2. Installation
Clone the repository and install dependencies for both the frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/hr_management?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="1d"
```

### 4. Database Setup
```bash
cd server
# Push the schema to the database
npx prisma db push

# Run the seeder to create the default Admin account and permission catalogs
npm run seed
```

### 5. Running the Application
You can run both servers simultaneously:
```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.
