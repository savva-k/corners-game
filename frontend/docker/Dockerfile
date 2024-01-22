FROM node:18-alpine as builder
WORKDIR /production

COPY package.json .
COPY tsconfig.json .
COPY src ./src
COPY public ./public
COPY .env .

RUN yarn
RUN yarn build

FROM caddy
WORKDIR /app

COPY --from=builder /production/build /usr/share/caddy
COPY ../config/caddy/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443
EXPOSE 443/udp
