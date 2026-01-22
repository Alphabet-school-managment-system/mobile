import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
  },
  lng: (
    (Localization as any).locale ??
    (Localization as any).locales?.[0]?.languageTag ??
    "en"
  ).split("-")[0],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
