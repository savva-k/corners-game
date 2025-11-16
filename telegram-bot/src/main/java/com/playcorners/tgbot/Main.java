package com.playcorners.tgbot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.longpolling.TelegramBotsLongPollingApplication;

public class Main {
    private static final Logger LOG = LoggerFactory.getLogger(Main.class);
    private static final String TG_BOT_TOKEN = "TG_BOT_TOKEN";
    private static final String CORNERS_GAME_URL = "CORNERS_GAME_URL";
    private static final String JWT_SECRET = "JWT_SECRET";

    public static void main(String[] args) {
        String tgBotToken = System.getenv(TG_BOT_TOKEN);
        String gameUrl = System.getenv(CORNERS_GAME_URL);
        String jwtSecret = System.getenv(JWT_SECRET);

        if (tgBotToken == null) {
            throw new IllegalStateException(TG_BOT_TOKEN + " not set");
        }

        if (gameUrl == null) {
            throw new IllegalStateException(CORNERS_GAME_URL + " not set");
        }

        if (jwtSecret == null) {
            throw new IllegalStateException(JWT_SECRET + " not set");
        }

        try (TelegramBotsLongPollingApplication app = new TelegramBotsLongPollingApplication()) {
            app.registerBot(tgBotToken, new GameBot(tgBotToken, gameUrl, jwtSecret));
            LOG.info("Telegram bot started");
            Thread.currentThread().join();
        } catch (Exception e) {
            LOG.error("Cannot start a bot", e);
        }
    }
}
