FROM node:18-alpine as builder
WORKDIR /production

COPY package.json .
COPY tsconfig.json .
COPY src ./src
COPY public ./public

RUN yarn
RUN yarn build

FROM caddy
WORKDIR /app

COPY --from=builder /production/build /usr/share/caddy

EXPOSE 80
