# 🚀 SETUP GUIDE - PlayStats Backend

Follow these steps to get your backend running.

---

## ✅ STEP 1: Get Supabase Credentials

### 1.1 Login to Supabase Dashboard

Go to: https://supabase.com/dashboard

### 1.2 Get Your Credentials

Click on your project → **Settings** → **API**

You'll need these 3 values:

1. **Project URL**
   - Example: `https://abcdefghijklm.supabase.co`
   - Copy this value

2. **Anon/Public Key** (anon key)
   - Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This is safe to use in frontend
   - Copy this value

3. **Service Role Key** (service_role key)
   - Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ KEEP THIS SECRET - Full database access
   - Copy this value

### 1.3 Get Database URL

Click on your project → **Settings** → **Database**

Scroll down to **Connection string** → **URI**

Select **Connection pooling** mode and copy the URI.

**IMPORTANT:** Replace `[YOUR-PASSWORD]` with your database password!

Example:
```
postgresql://postgres.abcdefghijklm:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

---

## ✅ STEP 2: Setup Environment Variables

### 2.1 Create .env file

```bash
cd backend
cp .env.example .env
```

### 2.2 Edit .env file

Open `backend/.env` and paste your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key

# Database (Direct Connection)
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Server
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1

# CORS (your frontend URL)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Save the file.**

---

## ✅ STEP 3: Install Dependencies

### 3.1 Install Bun (if not already installed)

**Windows:**
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Mac/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### 3.2 Install Project Dependencies

```bash
cd backend
bun install
```

This will install all packages (~30 seconds).

---

## ✅ STEP 4: Generate & Run Database Migrations

### 4.1 Generate Migration Files

```bash
bun run db:generate
```

This creates SQL migration files in `src/db/migrations/`.

### 4.2 Apply Migrations to Supabase

```bash
bun run db:migrate
```

This runs the migrations on your Supabase database.

✅ You should see: `Migrations completed successfully`

### 4.3 Verify Database (Optional)

Open Drizzle Studio to see your database:

```bash
bun run db:studio
```

Opens https://local.drizzle.studio - You'll see all your tables!

---

## ✅ STEP 5: Start Backend Server

```bash
bun run dev
```

You should see:

```
🚀 PlayStats Backend Server started
📡 Listening on http://localhost:3000
🌍 Environment: development
📝 API Prefix: /api/v1
```

---

## ✅ STEP 6: Test API

### 6.1 Test Health Check

Open your browser or use curl:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 6.2 Test Auth Endpoint

```bash
curl http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "username": "testuser"
  }'
```

If successful, you'll get a user object back!

---

## 🎉 SUCCESS!

Your backend is now running. You can:

1. ✅ Create users via signup API
2. ✅ Sign in users
3. ✅ Database is set up with all tables
4. ✅ Ready to build tournament/team/match APIs

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL is not defined"

Make sure you created `.env` file and added your Supabase credentials.

### Error: "Connection refused"

Check that:
1. DATABASE_URL is correct
2. You replaced `[YOUR-PASSWORD]` with actual password
3. Your IP is allowed in Supabase (should be by default)

### Error: "Migration failed"

Try:
```bash
# Delete existing migrations
rm -rf src/db/migrations/*

# Regenerate
bun run db:generate

# Try again
bun run db:migrate
```

### Bun not found

Restart your terminal after installing Bun.

---

## 📝 Next Steps

After backend is running:

1. **Test signup/login** from frontend
2. **Implement tournament API** (we'll do this next)
3. **Implement team registration** with phone number invites
4. **Add match scoring** features

---

## 🆘 Need Help?

Check:
- Backend README: `backend/README.md`
- Drizzle Studio: `bun run db:studio`
- Logs in terminal

Everything ready? Let's move on to frontend integration! 🚀
