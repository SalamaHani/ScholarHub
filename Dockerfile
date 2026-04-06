# syntax=docker/dockerfile:1

# ────────────────────────────────────────────
# Stage 1a — production dependencies only
# This layer is cached as long as package.json doesn't change.
# ────────────────────────────────────────────
FROM node:20-alpine AS deps-prod

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

# ────────────────────────────────────────────
# Stage 1b — all dependencies (prod + dev)
# Reuses the downloaded cache from stage 1a.
# ────────────────────────────────────────────
FROM node:20-alpine AS deps-dev

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ────────────────────────────────────────────
# Stage 2 — build Next.js
# ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Stay under 800 MB to avoid OOM on 1 GB servers
ENV NODE_OPTIONS="--max-old-space-size=800"

# Next.js incremental build cache — only changed pages recompile on rebuild.
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ────────────────────────────────────────────
# Stage 3 — minimal production image
# ────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
