FROM node:18-alpine
WORKDIR /app

# Copy corners-common

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.packages.json .

COPY corners-common/src ./corners-common/src
COPY corners-common/package.json ./corners-common/
COPY corners-common/tsconfig.json ./corners-common/

# Copy corners-server

COPY corners-server/src ./corners-server/src
COPY corners-server/package.json ./corners-server/
COPY corners-server/tsconfig.json ./corners-server/

# Build and run

RUN yarn
RUN yarn workspace corners-common build
RUN yarn workspace corners-server build
CMD ["yarn", "workspace", "corners-server", "start"]

EXPOSE 8080
EXPOSE 8090
