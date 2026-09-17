FROM node:20-alpine AS base

# Install pnpm (pinned to match the "packageManager" field in package.json,
# otherwise pnpm's self-management tries to fetch a native @pnpm/exe binary
# for the pinned version, which isn't published for linux-arm64-musl)
RUN npm install -g pnpm@9.0.0

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build types package
RUN pnpm --filter @bsn/types build

# Build UI package
RUN pnpm --filter @bsn/ui build

# Build web app
RUN pnpm --filter @bsn/web build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# next.config.js sets output: 'standalone', which traces only the
# dependencies actually used and copies them as real files (not the
# pnpm-symlinked workspace node_modules, which don't resolve once
# apps/web/node_modules is copied out on its own).
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Expose port
EXPOSE 3000

# Start the standalone server
CMD ["node", "apps/web/server.js"]
