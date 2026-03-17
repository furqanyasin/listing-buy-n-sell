# M02 — Authentication System

**Phase:** 2
**Status:** Complete
**Stack:** NestJS (backend) + Next.js App Router (frontend)

---

## Overview

Full JWT-based authentication with access + refresh token rotation, global guards, RBAC, and four frontend auth pages.

---

## Backend (`apps/api`)

### Architecture

```
src/modules/auth/
├── auth.module.ts
├── auth.controller.ts        POST /auth/register, /login, /refresh, /logout, /forgot-password, /reset-password
├── auth.service.ts           Business logic, bcrypt, token generation
├── dto/
│   ├── register.dto.ts
│   ├── login.dto.ts
│   ├── refresh-token.dto.ts
│   ├── forgot-password.dto.ts
│   └── reset-password.dto.ts
└── strategies/
    ├── jwt.strategy.ts        Bearer token (access)
    └── jwt-refresh.strategy.ts  Bearer token (refresh), named 'jwt-refresh'

src/modules/users/
├── users.module.ts
├── users.service.ts          findById, findByEmail, create, update, updatePassword
└── users.controller.ts       GET /users/me, PATCH /users/me

src/common/
├── guards/
│   ├── jwt-auth.guard.ts     Global guard — checks @Public() metadata
│   └── roles.guard.ts        Global guard — checks @Roles() metadata
├── decorators/
│   ├── public.decorator.ts   @Public() — bypasses JWT guard
│   ├── current-user.decorator.ts  @CurrentUser() — injects JWT payload
│   └── roles.decorator.ts   @Roles('ADMIN') — RBAC
├── filters/
│   └── http-exception.filter.ts  Returns { success, message, statusCode, timestamp, path }
└── interceptors/
    └── response.interceptor.ts   Wraps all responses in { success: true, message, data }
```

### Token Strategy

| Token | Expiry | Storage | Purpose |
|-------|--------|---------|---------|
| Access token | 15 min | Client memory / `Authorization` header | API auth |
| Refresh token | 7 days | DB (hashed with bcrypt) | Obtain new access token |

- Refresh tokens are stored **hashed** in the `RefreshToken` table
- Each refresh call **rotates** the refresh token (old one deleted)
- Multiple refresh tokens per user supported (multi-device)

### Global Setup (app.module.ts)

```ts
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },   // All routes protected by default
  { provide: APP_GUARD, useClass: RolesGuard },
  { provide: APP_FILTER, useClass: HttpExceptionFilter },
  { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
]
```

### Making Routes Public

```ts
@Public()          // bypasses JWT guard entirely
@Get('health')
health() { ... }

// Auth endpoints (register, login, etc.) use @Public() in auth.controller.ts
```

### Password Reset Flow

1. `POST /auth/forgot-password` — generates a reset token, stores hashed in `users.resetToken`
2. Dev mode: token logged to console (no email service yet)
3. `POST /auth/reset-password` — verifies token, updates password, clears token

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Create account, returns tokens |
| POST | `/auth/login` | Public | Login, returns tokens |
| POST | `/auth/refresh` | Bearer (refresh) | Rotate refresh token |
| POST | `/auth/logout` | Bearer (access) | Delete refresh token from DB |
| POST | `/auth/forgot-password` | Public | Send reset email (dev: log token) |
| POST | `/auth/reset-password` | Public | Reset password with token |
| GET | `/users/me` | Bearer (access) | Get current user profile |
| PATCH | `/users/me` | Bearer (access) | Update profile |
| GET | `/health` | Public | API health check |

---

## Frontend (`apps/web`)

### Files

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          Axios instance, JWT attach + refresh interceptor
│   │   └── auth.ts            registerApi, loginApi, logoutApi, etc.
│   ├── hooks/
│   │   └── use-auth.ts        TanStack Query mutations: useLogin, useRegister, etc.
│   └── validators/
│       └── auth.validators.ts  Zod: loginSchema, registerSchema, etc.
├── store/
│   └── auth.store.ts          Zustand persisted: user, accessToken, refreshToken, setAuth, clearAuth
├── middleware.ts              Protect /dashboard, /post-ad; redirect authed users from /auth/*
└── app/
    └── auth/
        ├── layout.tsx          Minimal auth layout (centered card, no header/footer)
        ├── login/page.tsx      Email + password form
        ├── register/page.tsx   Name + email + phone + password + confirm
        ├── forgot-password/page.tsx  Email input, success state
        └── reset-password/page.tsx   Token from URL query, new password form
```

### Axios Interceptor Pattern

```ts
// Attach token on every request
request: config.headers.Authorization = `Bearer ${store.accessToken}`

// On 401: attempt refresh, retry original request
response error: if (401 && !_retry) {
  newTokens = await refreshApi(refreshToken)
  store.setAuth(newTokens)
  retry original request with new access token
}
```

### Cookie for Middleware

On login, a `pw_auth_token` cookie is set (httpOnly not required here — middleware reads it for route protection). The JWT itself is stored in Zustand (localStorage persisted).

### Auth Store Shape

```ts
{
  user: { id, name, email, role } | null
  accessToken: string | null
  refreshToken: string | null
  setAuth(tokens, user): void
  clearAuth(): void
}
```

---

## Known Limitations

- Email sending is not implemented — password reset token is console.log'd in dev
- Email verification flow scaffolded in schema but not wired to API endpoints
- `pw_auth_token` cookie is client-set (via `document.cookie`) — could be upgraded to httpOnly via API Set-Cookie

---

## Testing

E2E flow verified:
1. `POST /auth/register` → returns `{ accessToken, refreshToken }`
2. `POST /auth/login` → returns `{ accessToken, refreshToken }`
3. `GET /users/me` with Bearer token → returns user profile
4. `GET /health` (Public) → `{ status: "ok" }`
