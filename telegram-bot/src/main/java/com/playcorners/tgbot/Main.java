package com.playcorners.tgbot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.longpolling.TelegramBotsLongPollingApplication;

public class Main {
    private static final Logger LOG = LoggerFactory.getLogger(Main.class);
    private static final String TG_BOT_TOKEN = "TG_BOT_TOKEN";
    private static final String CORNERS_GAME_URL = "CORNERS_GAME_URL";

    public static void main(String[] args) {
        String tgBotToken = System.getenv(TG_BOT_TOKEN);
        String gameUrl = System.getenv(CORNERS_GAME_URL);

        if (tgBotToken == null) {
            throw new IllegalStateException(TG_BOT_TOKEN + " not set");
        }

        if (gameUrl == null) {
            throw new IllegalStateException(CORNERS_GAME_URL + " not set");
        }

        try (TelegramBotsLongPollingApplication app = new TelegramBotsLongPollingApplication()) {
            app.registerBot(tgBotToken, new GameBot(tgBotToken, gameUrl));
            LOG.info("Telegram bot started");
            Thread.currentThread().join();
        } catch (Exception e) {
            LOG.error("Cannot start a bot", e);
        }
    }
}
