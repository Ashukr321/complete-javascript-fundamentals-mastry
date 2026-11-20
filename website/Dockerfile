# Build context is the REPO ROOT (the notes live outside website/):
#   docker build -f website/Dockerfile -t js-mastry .
# or, from website/: docker compose up --build

FROM node:20-alpine AS deps
WORKDIR /repo/website
COPY website/package.json website/package-lock.json website/.npmrc ./
RUN HUSKY=0 npm ci

FROM node:20-alpine AS builder
WORKDIR /repo
COPY . .
COPY --from=deps /repo/website/node_modules ./website/node_modules
WORKDIR /repo/website
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    BUILD_STANDALONE=true \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /repo/website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/website/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/website/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server.js"]
