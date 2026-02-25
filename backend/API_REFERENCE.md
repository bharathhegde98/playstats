# PlayStats Backend — API Reference

**Base URL:** `http://localhost:3000/api/v1`

**Framework:** Hono.js + TypeScript | **Database:** PostgreSQL + Drizzle ORM | **Auth:** Supabase

---

## Standard Response Envelope

Every response — success or error — follows this structure:

```json
{
  "success": true | false,
  "data": { },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

- `data` is present on success responses, absent on errors.
- `error` is present on error responses, absent on success.
- `meta.timestamp` is always present.

---

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are issued by Supabase on sign-in / sign-up. The token is a short-lived JWT; use the `refreshToken` to obtain a new access token when it expires.

---

## Endpoints at a Glance

| Method | Path | Auth | Status |
|--------|------|:----:|--------|
| GET | `/health` | No | ✅ Live |
| POST | `/auth/signup` | No | ✅ Live |
| POST | `/auth/signin` | No | ✅ Live |
| GET | `/auth/me` | Yes | ✅ Live |
| PATCH | `/auth/profile` | Yes | ✅ Live |
| POST | `/auth/signout` | Yes | ✅ Live |
| GET | `/tournaments` | No | ✅ Live |
| POST | `/tournaments` | Yes | ✅ Live |
| GET | `/tournaments/:id` | No | ✅ Live |
| GET | `/tournaments/join/:inviteCode` | No | ✅ Live |
| GET | `/teams` | — | 🔄 Coming Soon |
| GET | `/players` | — | 🔄 Coming Soon |
| GET | `/matches` | — | 🔄 Coming Soon |

---

## Health Check

### GET /health

Check that the server is running.

**Authentication:** None

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z",
  "environment": "development"
}
```

> Note: This endpoint returns a flat object, not the standard envelope.

---

## Authentication

### POST /auth/signup

Create a new user account.

**Authentication:** None

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "username": "johndoe"
}
```

| Field | Type | Required | Rules |
|-------|------|:--------:|-------|
| `phoneNumber` | string | Yes | International format: `+[country code][number]` e.g. `+919876543210` |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Minimum 8 characters |
| `fullName` | string | Yes | Minimum 2 characters |
| `username` | string | Yes | 3–20 characters, alphanumeric + underscore only |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "+919876543210",
      "email": "user@example.com",
      "fullName": "John Doe",
      "username": "johndoe",
      "avatarUrl": null,
      "bio": null,
      "status": "active",
      "role": "user",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Invalid field values |
| `CONFLICT` | 409 | Phone number or email already registered |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

### POST /auth/signin

Authenticate with email and password.

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

| Field | Type | Required |
|-------|------|:--------:|
| `email` | string | Yes |
| `password` | string | Yes |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "+919876543210",
      "email": "user@example.com",
      "fullName": "John Doe",
      "username": "johndoe",
      "avatarUrl": "https://...",
      "bio": "Cricket enthusiast",
      "status": "active",
      "role": "user",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastLoginAt": "2024-01-15T12:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | Wrong password |
| `NOT_FOUND` | 404 | No account with that email |

---

### GET /auth/me

Fetch the currently authenticated user's profile.

**Authentication:** Required

**Request Body:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phoneNumber": "+919876543210",
    "email": "user@example.com",
    "fullName": "John Doe",
    "username": "johndoe",
    "avatarUrl": "https://...",
    "bio": "Cricket enthusiast",
    "status": "active",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00Z",
    "lastLoginAt": "2024-01-15T12:00:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `NOT_FOUND` | 404 | User record deleted after token issued |

---

### PATCH /auth/profile

Update the current user's profile. All fields are optional — only send what needs to change.

**Authentication:** Required

**Request Body:**
```json
{
  "fullName": "John Smith",
  "username": "johnsmith",
  "bio": "Professional cricket player",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

| Field | Type | Required | Rules |
|-------|------|:--------:|-------|
| `fullName` | string | No | Minimum 2 characters |
| `username` | string | No | 3–20 characters, alphanumeric + underscore only |
| `bio` | string | No | Maximum 500 characters |
| `avatarUrl` | string | No | Must be a valid URL |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phoneNumber": "+919876543210",
    "email": "user@example.com",
    "fullName": "John Smith",
    "username": "johnsmith",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Professional cricket player",
    "status": "active",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `VALIDATION_ERROR` | 400 | Field fails validation rules |
| `CONFLICT` | 409 | Username already taken by another user |
| `NOT_FOUND` | 404 | User record not found |

---

### POST /auth/signout

Invalidate the current session token.

**Authentication:** Required

**Request Body:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Signed out successfully"
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

---

## Tournaments

### GET /tournaments

List tournaments with optional filtering and pagination.

**Authentication:** None

**Query Parameters:**

| Param | Type | Required | Values | Default |
|-------|------|:--------:|--------|---------|
| `sport` | string | No | `cricket`, `football`, `volleyball` | — (all sports) |
| `status` | string | No | `draft`, `open`, `ongoing`, `completed`, `cancelled` | — (all statuses) |
| `page` | integer | No | ≥ 1 | `1` |
| `limit` | integer | No | 1–50 | `20` |

**Example Request:**
```
GET /api/v1/tournaments?sport=cricket&status=open&page=1&limit=20
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cricket Premier League 2024",
      "slug": "cricket-premier-league-2024-abc123",
      "description": "National cricket tournament",
      "sportType": "cricket",
      "status": "open",
      "maxTeams": 16,
      "currentTeams": 8,
      "minPlayersPerTeam": 11,
      "maxPlayersPerTeam": 15,
      "startDate": "2024-02-01T00:00:00Z",
      "endDate": "2024-02-28T23:59:59Z",
      "venue": "Eden Gardens",
      "city": "Kolkata",
      "country": "India",
      "inviteCode": "abc12345",
      "allowPublicJoin": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "creator": {
        "id": "uuid",
        "fullName": "John Doe",
        "username": "johndoe"
      }
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

> `data` is always an array. Returns `[]` when no results match.

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Invalid query parameter value |
| `DATABASE_ERROR` | 500 | Database query failed |

---

### POST /tournaments

Create a new tournament. The authenticated user becomes the creator.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Cricket Premier League 2024",
  "description": "National cricket tournament",
  "sportType": "cricket",
  "maxTeams": 16,
  "minPlayersPerTeam": 11,
  "maxPlayersPerTeam": 15,
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-28T23:59:59Z",
  "venue": "Eden Gardens",
  "city": "Kolkata",
  "country": "India",
  "allowPublicJoin": true
}
```

| Field | Type | Required | Rules | Default |
|-------|------|:--------:|-------|---------|
| `name` | string | Yes | 3–100 characters | — |
| `description` | string | No | Max 500 characters | `null` |
| `sportType` | string | Yes | `cricket`, `football`, `volleyball` | — |
| `maxTeams` | integer | No | 2–64 | `16` |
| `minPlayersPerTeam` | integer | No | 1–30 | `11` |
| `maxPlayersPerTeam` | integer | No | 1–30 | `15` |
| `startDate` | string (ISO) | Yes | Valid ISO 8601 date-time | — |
| `endDate` | string (ISO) | No | Valid ISO 8601 date-time | `null` |
| `venue` | string | No | Max 200 characters | `null` |
| `city` | string | No | Max 100 characters | `null` |
| `country` | string | No | Max 100 characters | `null` |
| `allowPublicJoin` | boolean | No | — | `true` |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cricket Premier League 2024",
    "slug": "cricket-premier-league-2024-abc123",
    "description": "National cricket tournament",
    "sportType": "cricket",
    "status": "draft",
    "maxTeams": 16,
    "currentTeams": 0,
    "minPlayersPerTeam": 11,
    "maxPlayersPerTeam": 15,
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-02-28T23:59:59Z",
    "venue": "Eden Gardens",
    "city": "Kolkata",
    "country": "India",
    "inviteCode": "abc12345",
    "inviteLink": "/join/abc12345",
    "allowPublicJoin": true,
    "createdBy": "uuid",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

> Newly created tournaments always start with `status: "draft"` and `currentTeams: 0`. An `inviteCode` and `inviteLink` are auto-generated.

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `VALIDATION_ERROR` | 400 | Invalid field values |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

### GET /tournaments/:id

Fetch a single tournament by its UUID.

**Authentication:** None

**Path Parameters:**

| Param | Type | Required |
|-------|------|:--------:|
| `id` | UUID string | Yes |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cricket Premier League 2024",
    "slug": "cricket-premier-league-2024-abc123",
    "description": "National cricket tournament",
    "sportType": "cricket",
    "status": "open",
    "maxTeams": 16,
    "currentTeams": 8,
    "minPlayersPerTeam": 11,
    "maxPlayersPerTeam": 15,
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-02-28T23:59:59Z",
    "venue": "Eden Gardens",
    "city": "Kolkata",
    "country": "India",
    "inviteCode": "abc12345",
    "allowPublicJoin": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "creator": {
      "id": "uuid",
      "fullName": "John Doe",
      "username": "johndoe"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | `id` is not a valid UUID |
| `NOT_FOUND` | 404 | No tournament with that ID |
| `DATABASE_ERROR` | 500 | Database query failed |

---

### GET /tournaments/join/:inviteCode

Look up a tournament by its invite code. Use this to display tournament details before a user formally joins.

**Authentication:** None

**Path Parameters:**

| Param | Type | Required |
|-------|------|:--------:|
| `inviteCode` | string | Yes |

**Example Request:**
```
GET /api/v1/tournaments/join/abc12345
```

**Response:** `200 OK`

Same shape as `GET /tournaments/:id`.

**Error Codes:**

| Code | HTTP | When |
|------|------|------|
| `NOT_FOUND` | 404 | No tournament with that invite code |
| `DATABASE_ERROR` | 500 | Database query failed |

---

## Teams *(Coming Soon)*

These endpoints are planned but not yet implemented. The route exists and returns a placeholder.

```
GET    /teams                            List teams
POST   /teams                            Create team
GET    /teams/:id                        Get team details
PATCH  /teams/:id                        Update team
DELETE /teams/:id                        Delete team
POST   /teams/:id/players               Add player to team (via phone)
GET    /teams/:id/players               List team players
DELETE /teams/:id/players/:playerId     Remove player from team
```

---

## Players *(Coming Soon)*

```
GET    /players                          List all players
GET    /players/:id                      Get player details
GET    /players/:id/stats               Get player statistics
```

---

## Matches *(Coming Soon)*

```
GET    /matches                          List all matches
POST   /matches                          Create match
GET    /matches/:id                      Get match details
PATCH  /matches/:id                      Update match
GET    /matches/:id/live                 Get live match data
POST   /matches/:id/events              Add match event (goal, wicket, etc.)
GET    /matches/:id/events              List match events
```

---

## Common Error Codes

| Code | HTTP Status | Description |
|------|:-----------:|-------------|
| `VALIDATION_ERROR` | 400 | Request body or query param failed validation |
| `UNAUTHORIZED` | 401 | Token missing, expired, or invalid |
| `FORBIDDEN` | 403 | Authenticated but not allowed to perform this action |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource already exists (duplicate phone, email, username) |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server error |
| `DATABASE_ERROR` | 500 | Database operation failed |

**Validation Error Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email address" },
      { "field": "username", "message": "Must be 3–20 characters" }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

---

## Quick Start Examples

### cURL

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "username": "testuser"
  }'
```

**Sign In:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Get Profile:**
```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**List Cricket Tournaments:**
```bash
curl "http://localhost:3000/api/v1/tournaments?sport=cricket&status=open"
```

**Create Tournament:**
```bash
curl -X POST http://localhost:3000/api/v1/tournaments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Cricket Cup 2024",
    "sportType": "cricket",
    "maxTeams": 8,
    "startDate": "2024-03-01T00:00:00Z",
    "allowPublicJoin": true
  }'
```

**Lookup Tournament by Invite Code:**
```bash
curl http://localhost:3000/api/v1/tournaments/join/abc12345
```

### JavaScript / Fetch

```javascript
const BASE_URL = 'http://localhost:3000/api/v1';

// Sign in and store token
const { data } = await fetch(`${BASE_URL}/auth/signin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
}).then(r => r.json());

const token = data.accessToken;

// Create a tournament
const tournament = await fetch(`${BASE_URL}/tournaments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Cricket Cup 2024',
    sportType: 'cricket',
    maxTeams: 8,
    startDate: '2024-03-01T00:00:00Z'
  })
}).then(r => r.json());

console.log(tournament.data.inviteCode); // Share this with teams
```

---

## CORS

The server allows requests from the following origins:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
- Additional origins configurable via `ALLOWED_ORIGINS` environment variable

Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
Allowed headers: `Content-Type, Authorization`
