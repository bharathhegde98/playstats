# PlayStats Backend API

Modern, scalable backend API for PlayStats - Sports Statistics Platform

## 🏗️ Architecture

**Modular Monolith** with clear separation of concerns:
- **Database:** Supabase PostgreSQL
- **ORM:** Drizzle (Type-safe SQL)
- **Framework:** Hono (Fast, lightweight)
- **Runtime:** Bun (Fast JavaScript runtime)
- **Validation:** Zod
- **Auth:** Supabase Auth (JWT)

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication & user management
│   │   ├── tournaments/     # Tournament management
│   │   ├── teams/           # Team management
│   │   ├── players/         # Player management
│   │   ├── matches/         # Match management
│   │   └── analytics/       # Statistics & analytics
│   ├── shared/              # Shared utilities
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helpers, logger, response
│   │   └── types/           # Global TypeScript types
│   ├── db/                  # Database layer
│   │   ├── schema/          # Drizzle schema definitions
│   │   ├── migrations/      # Database migrations
│   │   └── seed/            # Seed data
│   ├── app.ts               # Hono app setup
│   └── server.ts            # Server entry point
├── tests/                   # Test files
├── .env.example             # Environment template
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Bun** installed (https://bun.sh)
- **Supabase** account (https://supabase.com)
- **PostgreSQL** (via Supabase)

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
```

**Required Environment Variables:**

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Direct Connection)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Server
PORT=3000
NODE_ENV=development
```

### 3. Generate Database Migrations

```bash
# This creates migration files from your schema
bun run db:generate
```

### 4. Run Migrations

```bash
# This applies migrations to your Supabase database
bun run db:migrate
```

### 5. Start Development Server

```bash
bun run dev
```

Server will start on `http://localhost:3000`

## 📊 Database Schema

### Core Tables

1. **users** - User accounts (active + shadow)
2. **tournaments** - Tournament/competition details
3. **teams** - Teams registered in tournaments
4. **team_players** - Players in teams (many-to-many)
5. **matches** - Tournament matches
6. **match_events** - Live match events (goals, wickets, etc.)
7. **tournament_admins** - Access control for tournaments
8. **notifications** - User notifications

### Key Concepts

- **Shadow Accounts:** Users can be added via phone number before they sign up
- **Phone Number Primary:** Unique identifier for all users
- **Tournament Creator:** Has ultimate access (creator role)
- **Team Manager:** Person who registered team, can add players

## 🔑 API Endpoints

### Authentication

```
POST   /api/v1/auth/signup      - Create new account
POST   /api/v1/auth/signin      - Sign in with email/password
GET    /api/v1/auth/me          - Get current user profile
PATCH  /api/v1/auth/profile     - Update profile
POST   /api/v1/auth/signout     - Sign out
```

### Tournaments (Coming Soon)

```
GET    /api/v1/tournaments          - List tournaments
POST   /api/v1/tournaments          - Create tournament
GET    /api/v1/tournaments/:id      - Get tournament details
PATCH  /api/v1/tournaments/:id      - Update tournament
DELETE /api/v1/tournaments/:id      - Delete tournament
```

### Teams (Coming Soon)

```
GET    /api/v1/teams               - List teams
POST   /api/v1/teams               - Register team
GET    /api/v1/teams/:id           - Get team details
PATCH  /api/v1/teams/:id           - Update team
POST   /api/v1/teams/:id/players   - Add player to team
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # Start dev server with hot reload

# Database
bun run db:generate      # Generate migrations from schema
bun run db:migrate       # Run migrations
bun run db:push          # Push schema directly (dev only)
bun run db:studio        # Open Drizzle Studio (DB GUI)
bun run db:seed          # Seed database with test data

# Build & Production
bun run build            # Build for production
bun run start            # Start production server

# Testing
bun run test             # Run tests
bun run test:watch       # Run tests in watch mode
```

## 🔐 Authentication Flow

### Sign Up

1. User provides phone, email, password, full name
2. Check if phone exists as shadow account
3. If shadow account exists, claim it (upgrade to active)
4. Otherwise, create new active account
5. Return user + JWT token

### Sign In

1. User provides email + password
2. Verify with Supabase Auth
3. Get user from database
4. Return user + JWT token

### Protected Routes

All protected routes require `Authorization: Bearer <token>` header.

## 📝 Database Migration Workflow

```bash
# 1. Modify schema files in src/db/schema/
# 2. Generate migration
bun run db:generate

# 3. Review migration in src/db/migrations/
# 4. Apply migration
bun run db:migrate

# 5. Verify in Drizzle Studio
bun run db:studio
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test src/modules/auth/auth.service.test.ts

# Watch mode
bun test --watch
```

## 🐛 Debugging

Enable debug logging:

```env
LOG_LEVEL=debug
```

## 🚢 Deployment

### Environment Setup

1. Set all required environment variables on your hosting platform
2. Run migrations: `bun run db:migrate`
3. Build: `bun run build`
4. Start: `bun run start`

### Recommended Platforms

- **Railway** (Easiest)
- **Fly.io**
- **Render**
- **AWS/GCP** (Advanced)

## 📚 Tech Stack Details

- **Bun:** Fast JavaScript runtime (3x faster than Node.js)
- **Hono:** Ultrafast web framework (fastest in benchmarks)
- **Drizzle ORM:** Type-safe SQL query builder
- **Supabase:** PostgreSQL + Auth + Realtime + Storage
- **Zod:** TypeScript-first schema validation
- **TypeScript:** Type safety

## 🤝 Contributing

1. Create feature branch
2. Write tests
3. Ensure `bun test` passes
4. Submit pull request

## 📄 License

MIT
