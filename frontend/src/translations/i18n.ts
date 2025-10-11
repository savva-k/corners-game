import i18next from "i18next";
import cn from "./cn.json";
import en from "./en.json";
import ru from "./ru.json";

i18next.init({
    resources: {
        "cn": cn,
        "en": en,
        "ru": ru
    },
    lng: "ru",
});

export default i18next.t;