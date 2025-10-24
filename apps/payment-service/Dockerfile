FROM oven/bun:1.2.15-alpine

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

CMD ["bun", "run", "dev"]
