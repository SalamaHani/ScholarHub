# syntax=docker/dockerfile:1
# ^^^ Enables BuildKit cache mounts. Must stay on the first line.

# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json ./

# Cache mount keeps downloaded packages on the host disk between builds.
# Packages are NOT re-fetched unless package-lock.json changes.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# ============================================================
# Stage 2: Build the application
# ============================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (required before build)
RUN npx prisma generate

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Limit Node heap to 768 MB so the build does not OOM-kill on a 1 GB server.
# TypeScript/ESLint checks are skipped in next.config.mjs — that is what
# caused the previous 4000-second build on this hardware.
ENV NODE_OPTIONS="--max-old-space-size=768"

# Cache mount keeps Next.js webpack/SWC incremental output on the host.
# Only changed pages are recompiled on subsequent builds.
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ============================================================
# Stage 3: Production runner (minimal image)
# ============================================================
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs && \
    mkdir -p /app/data && chown nextjs:nodejs /app/data

COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "node_modules/.bin/prisma db push --skip-generate && node server.js"]
