FROM node:18-alpine as builder
WORKDIR /build

# Copy corners-common

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.packages.json .

COPY corners-common/src ./corners-common/src
COPY corners-common/package.json ./corners-common/
COPY corners-common/tsconfig.json ./corners-common/

# Copy corners-client

COPY corners-client/src ./corners-client/src
COPY corners-client/package.json ./corners-client/
COPY corners-client/tsconfig.json ./corners-client/

# Copy corners-frontend

COPY corners-frontend/src ./corners-frontend/src
COPY corners-frontend/public ./corners-frontend/public
COPY corners-frontend/package.json ./corners-frontend/
COPY corners-frontend/tsconfig.json ./corners-frontend/

# Build and run

RUN yarn
RUN yarn workspace corners-common build
RUN yarn workspace corners-client build
RUN yarn workspace corners-frontend build

# Eventually run the build on the Caddy server

FROM caddy:2
WORKDIR /app

COPY --from=builder /build/corners-frontend/build/ /usr/share/caddy/

EXPOSE 80
