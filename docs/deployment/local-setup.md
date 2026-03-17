# Local Development Setup

## Prerequisites
- Node.js 20+
- npm 10+
- Docker Desktop

## Quick Start

### 1. Clone and install
```bash
git clone <repo-url> pw-clone
cd pw-clone
npm install
```

### 2. Environment variables
```bash
cp .env.example .env
# Edit .env — fill in Cloudinary keys, SMTP if needed
```

### 3. Start infrastructure
```bash
docker-compose up -d
# Starts: PostgreSQL (5432), Redis (6379), pgAdmin (5050), Redis Commander (8081)
```

### 4. Run database migrations
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
# Optional: seed
npm run db:seed
```

### 5. Start development servers
```bash
# From root — starts both web and api
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- Swagger: http://localhost:4000/api/docs
- pgAdmin: http://localhost:5050 (admin@pw-clone.com / admin123)
- Redis Commander: http://localhost:8081

## Useful Commands
```bash
npm run build          # Build all apps
npm run lint           # Lint all packages
npm run test           # Run all tests
npm run format         # Format all files with Prettier

# Database
cd apps/api
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Create and run migration
npm run db:seed        # Seed reference data
```
