FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

RUN yarn global add pm2

CMD ["yarn", "run", "start:prod"]