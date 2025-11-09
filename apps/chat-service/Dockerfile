FROM node:24-alpine3.21 AS build

RUN apk add --no-cache curl bash

RUN npm install -g bun

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lock bun.lock

COPY apps/chat-service/package.json ./apps/chat-service/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN bun install

COPY apps/chat-service ./apps/chat-service
COPY packages/shared ./packages/shared

WORKDIR /app/apps/chat-service


# Run build - esbuild will resolve from workspace root node_modules via nodePaths
RUN bun run build

FROM node:24-alpine3.21

RUN apk add --no-cache curl

WORKDIR /app

# Copy only the built files and necessary runtime files
COPY --from=build /app/apps/chat-service/build ./build
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "./build/server.js"]
