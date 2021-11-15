FROM node:14-alpine

RUN apk add --no-cache git
WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive
RUN yarn cache clean

ARG BASE_PATH=""
ENV NEXT_TELEMETRY_DISABLED=1 \
    BASE_PATH=$BASE_PATH 

COPY . .
RUN yarn typechain
RUN yarn build

CMD ["yarn", "start"]
