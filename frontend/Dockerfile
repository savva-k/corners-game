FROM node:25-alpine3.21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG CORNERS_SERVER_API_URL
ARG CORNERS_SERVER_WEBSOCKET_URL
ENV VITE_CORNERS_SERVER_API_URL=${CORNERS_SERVER_API_URL}
ENV VITE_CORNERS_SERVER_WEBSOCKET_URL=${CORNERS_SERVER_WEBSOCKET_URL}
RUN npm run build

FROM busybox:stable AS runner
WORKDIR /app
COPY --from=builder /app/build .
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]
