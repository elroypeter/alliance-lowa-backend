FROM node:14.17.6

RUN npm install -g pnpm

WORKDIR /app

COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then pnpm install; \
    else pnpm install; \
    fi

COPY . .
EXPOSE ${PORT}
CMD ["pnpm", "serve:prod"]