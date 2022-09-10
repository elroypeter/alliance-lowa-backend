FROM node:14.17.6

RUN npm install -g pnpm

WORKDIR /app

COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then pnpm install; \
    else pnpm install --prod; \
    fi

COPY . .

# precompile ts files
RUN if [ "$NODE_ENV" = "production" ]; \
    then pnpm preserve:prod; \
    fi

EXPOSE ${PORT}
CMD ["pnpm", "serve:prod"]