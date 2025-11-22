# Build
FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run
FROM eclipse-temurin:latest
COPY --from=build /app/target/tgbot-1.0-SNAPSHOT-jar-with-dependencies.jar ./tgbot.jar
ENTRYPOINT ["java", "-jar", "tgbot.jar"]
