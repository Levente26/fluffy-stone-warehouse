import en from "./locales/en.json";
import hu from "./locales/hu.json";

export default defineI18nConfig((nuxt) => ({
  legacy: false,
  locale: "en",
  messages: {
    en: en,
    hu: hu,
  },
}));
