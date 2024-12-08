package com.playcorners.util;

public class ValidationConstants {

    public static final String LOGIN_REGEXP = "[a-zA-Z\\-_0-9]{5,}";
    public static final String INVALID_LOGIN_MESSAGE = "server.validation:invalid_login";

    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    public static final String PASSWORD_REGEXP = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$";
    public static final String INVALID_PASSWORD_MESSAGE = "server.validation:invalid_password";

    public static final String UUID_REGEXP = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";

    public static final String ALPHANUMERIC_WITH_DELIMITERS_64_SYMBOLS_REGEXP = "^[a-zA-Z0-9\\.\\-\\_]{1,64}$";
    public static final String MAP_NAME = ALPHANUMERIC_WITH_DELIMITERS_64_SYMBOLS_REGEXP;
    public static final String IMAGE_NAME = ALPHANUMERIC_WITH_DELIMITERS_64_SYMBOLS_REGEXP;

    public static final String INVALID_GAME_ID = "server.validation:invalid_game_id";
    public static final String INVALID_MAP_NAME = "server.validation:invalid_map_name";
    public static final String INVALID_IMAGE_NAME = "server.validation:invalid_image_name";

}
