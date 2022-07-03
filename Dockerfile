FROM node:16.15.1

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "start:dev"]