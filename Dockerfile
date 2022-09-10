FROM node:14.17.6

RUN npm install -g pnpm

WORKDIR /app

COPY package.json .

RUN pnpm install

COPY . .
EXPOSE ${PORT}
CMD ["pnpm", "serve:prod"]