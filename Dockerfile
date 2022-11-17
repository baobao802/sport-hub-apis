FROM node:16.15.1

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

#RUN set -x && yarn run build

#EXPOSE 80

#CMD ["yarn", "start:prod"]
CMD ["yarn", "start:dev"]
