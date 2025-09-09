FROM node:24-alpine3.21

RUN apk add --no-cache curl

RUN npm install -g bun

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

CMD ["bun", "run", "dev"]
