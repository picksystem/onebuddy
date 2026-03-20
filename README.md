# TravelMate — Mobility Platform

A full-stack ride-hailing and mobility platform similar to **Uber, Rapido, and Ola** — built as a monorepo with React (Admin Web), Express backend, shared TypeScript interfaces, and multi-role support.

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-green.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4-purple.svg)](https://www.prisma.io/)
[![NX](https://img.shields.io/badge/NX-22.4-143055.svg)](https://nx.dev/)

---

## What is TravelMate?

TravelMate is a mobility-as-a-service platform where:

- **Users** request rides, hire drivers, or rent vehicles
- **Captains** are verified drivers who fulfill ride and service requests
- **Admins** manage the entire platform — users, captains, bookings, and content

Think of it as the backend operations layer for a company like Rapido or Ola — where admins control who can drive, approve requests, manage fleets, and monitor platform activity.

---

## Table of Contents

- [Roles & Access](#roles--access)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Admin Panel Routes](#admin-panel-routes)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Development Commands](#development-commands)
- [Troubleshooting](#troubleshooting)

---

## Roles & Access

| Role | Who They Are | What They Can Do |
|------|-------------|-----------------|
| **Admin** | Platform operator | Full control — manage users, captains, bookings, content, approvals |
| **Captain** | Driver / service provider | Accept trips, manage their profile and availability |
| **User** | Passenger / customer | Request rides, hire drivers, rent vehicles |

### How roles work

1. A new person signs up — they start as a **User** by default
2. If they want to be a **Captain**, they submit a role request
3. An **Admin** reviews and approves or rejects the request
4. Once approved as Captain, they can accept bookings

---

## Key Features

### For Users
- Request a ride or trip
- Hire a driver (for personal/business use)
- Rent a vehicle
- View booking history
- Manage their profile

### For Captains
- Receive and accept ride/hire requests
- View their assigned trips
- Manage availability
- Build their captain profile (vehicle, role, SLA calendar)

### For Admins

**Governance**
- Dashboard with live platform statistics
- Audit trails — full history of every action taken
- Events monitoring
- Access request approvals (role change requests)

**People & Organizations**
- Customer Management — create, edit, activate/deactivate users
- Captain Management — approve captains, view captain profiles
- Driver Hire requests — match users with available drivers
- Vehicle Rental requests — assign vehicles to rental requests
- Organizations — manage partner or corporate accounts

**Platform Content**
- Fast Tag Requests — manage toll/fast tag applications
- Subscriptions — manage platform subscription plans
- Collections — curated groups of services or routes
- Categories — organize service types

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd onebuddy

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed
```

### Default Test Accounts (after seeding)

```
admin@bandi.com    / admin123     → Admin role
captain@bandi.com  / captain123   → Captain role
user@bandi.com     / user123      → User role
```

---

## Project Structure

```
onebuddy/
├── gateways/                     # Backend (Express API)
│   ├── api/
│   │   ├── admin/                # Admin API routes
│   │   ├── auth/                 # Auth routes (signin, signup, OTP)
│   │   ├── user/                 # User API routes
│   │   └── captain/              # Captain API routes
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── seed.ts               # Seed data
│   │   └── migrations/
│   └── src/
│       ├── app.ts                # Express app
│       └── server.ts             # Server entry
│
├── libs/                         # Shared libraries
│   ├── entities/                 # TypeScript interfaces (shared FE + BE)
│   │   ├── interfaces/
│   │   └── validations/          # Yup schemas
│   ├── core/                     # Backend-only logic
│   │   ├── use-cases/            # Business logic (one class per operation)
│   │   └── infrastructure/       # Prisma & InMemory gateway implementations
│   ├── ui/                       # Frontend-only code
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/
│   │   │   ├── admin/            # Admin panel pages
│   │   │   ├── user/             # User-facing pages
│   │   │   └── shared/           # Auth pages (signin, signup)
│   │   ├── hooks/
│   │   └── store/                # Redux store + slices
│   ├── services/                 # RTK Query API services
│   ├── theme/                    # MUI theme system
│   └── shared/constants/         # Route paths and app constants
│
├── web/                          # Frontend application entry
│   └── src/
│       ├── app.tsx               # Root with routing
│       └── app/routes.ts         # Lazy-loaded route definitions
│
├── env/src/                      # Environment configs
├── docker-compose.yml            # PostgreSQL + Redis
└── tsconfig.base.json
```

---

## Running the App

```bash
# Start backend API — http://localhost:3001
npm run dev:backend

# Start admin web app — http://localhost:1600
npm run serve:administration

# Start Storybook (component library preview)
npm run storybook               # http://localhost:6006
```

| App | URL |
|-----|-----|
| Admin Web | http://localhost:1600 |
| Backend API | http://localhost:3001 |
| Storybook | http://localhost:6006 |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=3001
HOST=localhost

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/travelmate_db?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGIN=http://localhost:1600

# Email (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=TravelMate <noreply@travelmate.com>
```

> **Dev tip:** In `NODE_ENV=development`, OTPs are printed to the console — you don't need real SMTP to test sign-up or password reset.

### Gmail App Password (for SMTP)
1. Enable 2FA on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate a password for "Mail" and paste it as `SMTP_PASS`

---

## Docker Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

| Service | Port |
|---------|------|
| PostgreSQL (`travelmate_db`) | 5432 |
| Redis | 6379 |

---

## Admin Panel Routes

| Route | Page |
|-------|------|
| `/admin/dashboard` | Overview with live stats |
| `/admin/audit-trails` | Full action history log |
| `/admin/events` | Platform events |
| `/admin/access-request` | Role change approvals |
| `/admin/users` | All registered users |
| `/admin/captains` | Captain profiles |
| `/admin/driver-hire` | Driver hire requests |
| `/admin/vehicle-rental` | Vehicle rental requests |
| `/admin/user-management` | Create/edit/deactivate users |
| `/admin/organizations` | Corporate accounts |
| `/admin/tags` | Fast tag requests |
| `/admin/subscriptions` | Subscription plans |
| `/admin/collections` | Service collections |
| `/admin/categories` | Service categories |
| `/admin/profile` | Admin profile |
| `/admin/settings` | System settings |

---

## API Endpoints

### Auth (`/api/auth/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/signin` | Sign in |
| POST | `/forgot-password` | Request OTP for password reset |
| POST | `/verify-otp` | Verify OTP |
| POST | `/reset-password` | Set new password |

### Admin Auth Actions (`/api/auth/action`)

All admin user/captain management flows go through a single action endpoint:

| Action | Description |
|--------|-------------|
| `get-all-users` | List all users |
| `create-user` | Create a new user |
| `update-user` | Edit user details |
| `activate-user` / `deactivate-user` | Toggle user access |
| `get-pending-role-requests` | Get pending captain/admin requests |
| `approve-role-request` / `reject-role-request` | Handle role requests |
| `get-captain-profiles` | List captain profiles |
| `get-driver-hire-requests` | List driver hire requests |
| `match-driver-hire` / `reject-driver-hire` | Process driver hire |
| `get-vehicle-rental-requests` | List vehicle rental requests |
| `assign-vehicle-rental` / `reject-vehicle-rental` | Process vehicle rental |
| `get-login-logs` | View login activity |
| `reset-user-password` | Force reset a user's password |
| `generate-temp-password` | Send temporary password via email |

---

## Technology Stack

### Backend

| | Technology | Purpose |
|--|------------|---------|
| Server | Express.js 4.18 | REST API |
| Database | PostgreSQL 15 | Data storage |
| ORM | Prisma 7.4 | DB access |
| Cache | Redis 7 | Sessions & performance |
| Auth | JWT | Stateless authentication |
| Realtime | Socket.IO 4.8 | Live updates |
| Payments | Razorpay | In-app transactions |
| Push | Firebase Admin | Notifications |
| Email | Nodemailer | OTPs & transactional mail |
| Language | TypeScript 5.9 | Type safety |

### Frontend

| | Technology | Purpose |
|--|------------|---------|
| Framework | React 19 | Admin UI |
| UI | MUI v7 | Component library |
| State | Redux Toolkit | Global state |
| Forms | Formik + Yup | Form handling |
| Styling | Emotion + tss-react | CSS-in-JS |
| Charts | ApexCharts | Dashboard analytics |
| Maps | Google Maps | Route & tracking |
| Routing | React Router 6 | Page navigation |

### Tooling

| | Technology |
|--|------------|
| Monorepo | NX 22.4 |
| Build | Webpack 5 |
| Testing | Jest 30 |
| Components | Storybook 10 |
| Linting | ESLint 9 |
| Formatting | Prettier 3 |
| Git Hooks | Husky 9 |

---

## Development Commands

```bash
# Backend
npm run dev:backend              # Start with hot reload
npm run build:backend            # Build

# Frontend
npm run serve:administration     # Dev server (port 1600)
npm run build:administration     # Production build

# Database
npm run prisma:generate          # Generate Prisma client
npm run prisma:migrate           # Push schema to DB (dev)
npm run prisma:seed              # Seed test data
npm run prisma:studio            # Open Prisma Studio GUI
npm run prisma:reset             # Wipe and recreate DB
npm run prisma:deploy            # Apply migrations (production)

# Quality
npm run lint                     # Lint
npm run lint:fix                 # Auto-fix lint
npm run format                   # Format with Prettier
npm run type-check               # TypeScript check
npm run validate                 # Format + Lint + Type check
npm test                         # Run all tests
```

---

## Troubleshooting

**OTP not received**
- In dev mode, OTP prints to the terminal — no email needed
- For real emails, check `SMTP_*` values in `.env`

**Database won't connect**
```bash
docker-compose up -d             # Make sure containers are running
npm run prisma:migrate           # Re-run migrations
```

**Build errors after pulling changes**
```bash
rm -rf node_modules .nx dist
npm install
npm run prisma:generate
```

**Port already in use**
```bash
# Windows
netstat -ano | findstr :1600
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:1600 | xargs kill -9
```

**NX cache issues**
```bash
npx nx reset
```

---

## License

MIT

---

**Last Updated:** March 2026
