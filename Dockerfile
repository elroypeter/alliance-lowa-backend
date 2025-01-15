FROM node:16.19.0

RUN npm install -g yarn --force

RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN yarn install

RUN mkdir public 

COPY . .
EXPOSE ${PORT}
CMD ["yarn", "serve:prod"]