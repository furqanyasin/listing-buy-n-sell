# System Architecture Overview

## Monorepo Structure
```
pw-clone/
├── apps/
│   ├── web/          # Next.js 15 frontend (port 3000)
│   └── api/          # NestJS backend (port 4000)
├── packages/
│   ├── ui/           # Shared React components
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configs
├── docs/             # Architecture documentation
├── plans/            # Roadmap and planning
├── memory/           # AI memory files
└── docker-compose.yml
```

## Services (Local Dev)
| Service | Port | URL |
|---------|------|-----|
| Next.js Web | 3000 | http://localhost:3000 |
| NestJS API | 4000 | http://localhost:4000/api/v1 |
| Swagger Docs | 4000 | http://localhost:4000/api/docs |
| PostgreSQL | 5432 | - |
| pgAdmin | 5050 | http://localhost:5050 |
| Redis | 6379 | - |
| Redis Commander | 8081 | http://localhost:8081 |

## API Design Principles
- Versioned: `/api/v1/`
- REST-first, API-first
- All responses follow `{ success, message, data }` envelope
- Paginated responses follow `{ data[], meta: { total, page, limit, totalPages } }`
- JWT Bearer auth on protected routes
- Rate limited: 10 req/s (short), 100 req/min (long)
- Input validated via class-validator DTOs
- Errors follow RFC 7807 format
