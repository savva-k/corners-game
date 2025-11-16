package com.playcorners.tgbot;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.methods.AnswerCallbackQuery;
import org.telegram.telegrambots.meta.api.methods.AnswerInlineQuery;
import org.telegram.telegrambots.meta.api.objects.CallbackQuery;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.api.objects.inlinequery.InlineQuery;
import org.telegram.telegrambots.meta.api.objects.inlinequery.result.InlineQueryResultGame;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;

import java.util.Map;

public class GameBot implements LongPollingSingleThreadUpdateConsumer {
    private final Logger LOG = LoggerFactory.getLogger(GameBot.class);
    private final TelegramClient client;
    private final String gameUrl;
    private final String jwtSecret;

    public GameBot(String token, String gameUrl, String jwtSecret) {
        this.client = new OkHttpTelegramClient(token);
        this.gameUrl = gameUrl;
        this.jwtSecret = jwtSecret;
    }

    @Override
    public void consume(Update update) {
        if (update.hasInlineQuery()) {
            handle(update.getInlineQuery());
        } else if (update.hasCallbackQuery()) {
            handle(update.getCallbackQuery());
        }
    }

    private void handle(InlineQuery inlineQuery) {
        LOG.debug("Inline query: {}", inlineQuery);
        AnswerInlineQuery answer = AnswerInlineQuery.builder()
                .inlineQueryId(inlineQuery.getId())
                .result(InlineQueryResultGame.builder()
                        .id("1")
                        .gameShortName("corners")
                        .build())
                .build();

        try {
            client.execute(answer);
        } catch (TelegramApiException e) {
            LOG.error("Error executing query {}: {}", answer, e);
        }
    }

    private void handle(CallbackQuery query) {
        LOG.debug("Callback query: {}", query);
        User user = query.getFrom();
        LOG.info("Callback query from user id={} name='{} {}' username={} lang={} premium={}", user.getId(), user.getFirstName(), user.getLastName(), user.getUserName(), user.getLanguageCode(), user.getIsPremium());

        String testUserToken = generateJwtToken("test", 999L, "en", query.getInlineMessageId());

        AnswerCallbackQuery answer = AnswerCallbackQuery.builder()
                .callbackQueryId(query.getId())
                .showAlert(true)
                .url(this.gameUrl + "/?test=" + testUserToken + "&token=" + generateJwtToken(query))
                .build();

        try {
            client.execute(answer);
        } catch (TelegramApiException e) {
            LOG.error("Error executing query {}: {}", answer, e);
        }
    }

    private String generateJwtToken(CallbackQuery query) {
        return generateJwtToken(query.getFrom().getUserName(), query.getFrom().getId(), query.getFrom().getLanguageCode(), query.getInlineMessageId());
    }

    private String generateJwtToken(String username, Long userId, String lang, String inlineMessageId) {
        return JWT.create()
                .withPayload(
                        Map.of(
                                "username", username,
                                "userId", userId,
                                "lang", lang,
                                "inlineMessageId", inlineMessageId
                        )
                )
                .sign(Algorithm.HMAC256(jwtSecret));
    }
}
