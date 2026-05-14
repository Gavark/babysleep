# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Create /data so SvelteKit post-build analysis can open the DB during analyse phase
RUN mkdir -p /data && DATABASE_PATH=/data/build-probe.sqlite npm run build && rm -f /data/build-probe.sqlite

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/babysleep.sqlite
ENV PORT=3000

# Production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built app + migrations
COPY --from=build /app/build ./build
COPY drizzle ./drizzle
# Copy the whole db directory so migrate.ts relative imports (./index, ./schema) resolve correctly
COPY src/lib/server/db ./src/lib/server/db
COPY scripts ./scripts

# Migrate at startup then run
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e
node --import tsx /app/src/lib/server/db/migrate.ts
exec node /app/build/index.js
EOF
RUN chmod +x /app/start.sh

# Pre-create /data with correct ownership so 'node' user can write to it at runtime
RUN mkdir -p /data && chown node:node /data

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["/app/start.sh"]
