FROM node:23-alpine

RUN addgroup app && adduser -S -G app app

WORKDIR /app

COPY package*.json ./

RUN chown -R app:app /app

USER app

RUN npm install

COPY . .

USER root

RUN chown -R app:app /app 

USER app

CMD [ "npm", "run", "dev" ]
