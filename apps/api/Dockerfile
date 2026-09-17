FROM node:20-alpine AS base

# Install pnpm (pinned to match the "packageManager" field in package.json,
# otherwise pnpm's self-management tries to fetch a native @pnpm/exe binary
# for the pinned version, which isn't published for linux-arm64-musl)
RUN npm install -g pnpm@9.0.0

# Build stage
FROM base AS builder
WORKDIR /app

# better-sqlite3 needs to compile its native bindings for this platform
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build types package
RUN pnpm --filter @bsn/types build

# Build API
RUN pnpm --filter @bsn/api build

# Produce a self-contained prod-only copy of the package: pnpm's workspace
# node_modules are symlinks into the monorepo root's .pnpm store, which break
# once apps/api/node_modules is copied out on its own into the runner stage.
RUN pnpm --filter @bsn/api --prod deploy /prod/api

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /prod/api/dist ./dist
COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /prod/api/package.json ./

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/main"]
