# syntax=docker/dockerfile:1

# ────────────────────────────────────────────
# Stage 1 — install dependencies
# ────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

# Cache mount: npm packages are stored on the host between builds.
# On rebuild, only new/changed packages are downloaded.
RUN --mount=type=cache,target=/root/.npm \
    NODE_OPTIONS="--max-old-space-size=512" \
    npm ci --no-audit --no-fund

# ────────────────────────────────────────────
# Stage 2 — build Next.js
# ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Prevent OOM kill on 1 GB servers during compilation
ENV NODE_OPTIONS="--max-old-space-size=768"

# Cache mount: Next.js stores incremental compile cache here.
# On rebuild, only changed pages are recompiled.
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
