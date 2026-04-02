# syntax=docker/dockerfile:1
# ^^^ Enables BuildKit cache mounts. Must stay on the first line.

# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

# Cache mount keeps downloaded packages on the host disk between builds.
# Packages are NOT re-fetched unless package-lock.json changes.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

# ============================================================
# Stage 2: Build the application
# ============================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Limit Node heap to 768 MB so the build does not OOM on a 1 GB server.
# TypeScript type-checking and ESLint are skipped in next.config.mjs —
# those were the cause of the 4000-second build on low-resource hardware.
ENV NODE_OPTIONS="--max-old-space-size=768"

# Cache mount keeps Next.js webpack/SWC incremental output on the host.
# Only changed pages are recompiled on subsequent builds.
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ============================================================
# Stage 3: Production runner (minimal image)
# ============================================================
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
