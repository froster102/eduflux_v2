FROM oven/bun:1.2.15 AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

COPY /apps/analytics-service/package.json ./apps/analytics-service/package.json
COPY /packages/shared/package.json ./packages/shared/package.json

RUN bun install

COPY apps/analytics-service ./apps/analytics-service
COPY packages/shared ./packages/shared

WORKDIR /app/apps/analytics-service

RUN bun run build

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/apps/analytics-service/build/server ./server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3012
