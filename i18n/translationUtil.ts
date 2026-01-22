import enTranslations from "@/i18n/locales/en.json";

export function isTranslationKeyValid(key: any) {
  return Object.prototype.hasOwnProperty.call(enTranslations, key);
}
