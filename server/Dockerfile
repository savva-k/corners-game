# Build
FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run
FROM eclipse-temurin:latest
WORKDIR /app
COPY --from=build /app/target/corners-game-server-0.0.1-SNAPSHOT.jar ./server.jar
CMD ["java", "-jar", "server.jar"]
