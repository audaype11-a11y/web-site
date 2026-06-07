# Use Bun as base image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies stage
FROM base AS deps
# Copy package files first
COPY package.json bun.lock ./
# Copy prisma schema before install (needed for postinstall)
COPY prisma ./prisma/
RUN bun install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Set environment variable for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Build the application
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user (Debian/Ubuntu style)
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Create uploads directory BEFORE copying files
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run db push and start server
CMD ["sh", "-c", "bunx prisma db push --accept-data-loss && bun server.js"]
