FROM node:24-alpine3.21 AS build

RUN apk add --no-cache curl bash

RUN npm install -g bun

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lock bun.lock

COPY apps/gateway/package.json ./apps/gateway/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN bun install

COPY apps/gateway ./apps/gateway
COPY packages/shared ./packages/shared

WORKDIR /app/apps/gateway

RUN bun run build

FROM node:24-alpine3.21

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=build /app/apps/gateway/build ./build
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "./build/server.js"]
