# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install turbo globally for monorepo builds
RUN npm install -g turbo

# Copy monorepo root files
COPY package*.json turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/

# Install dependencies (all workspaces)
RUN npm ci --workspace=apps/api --workspace=packages/types --if-present

# Copy source
COPY apps/api ./apps/api
COPY packages/types ./packages/types

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build shared types first, then api
RUN cd packages/types && npm run build
RUN cd apps/api && npm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy Prisma schema (needed at runtime for migrations)
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/api/node_modules/@prisma ./node_modules/@prisma

# Copy built output
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 4000

CMD ["node", "dist/main"]
