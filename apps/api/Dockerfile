FROM node:20-alpine AS base

# Install pnpm (pinned to match the "packageManager" field in package.json,
# otherwise pnpm's self-management tries to fetch a native @pnpm/exe binary
# for the pinned version, which isn't published for linux-arm64-musl)
RUN npm install -g pnpm@9.0.0

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
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

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/main"]
