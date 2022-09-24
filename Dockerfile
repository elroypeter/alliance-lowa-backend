FROM node:14.17.6

RUN npm install -g pnpm

RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN pnpm install

RUN mkdir public 

COPY . .
EXPOSE ${PORT}
CMD ["pnpm", "serve:prod"]