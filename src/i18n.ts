import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getLocaleFromPathname } from "@/lib/locale";

const initialLanguage =
  typeof window === "undefined" ? "zh_CN" : getLocaleFromPathname(window.location.pathname);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    react: {
      // 是否需要在最外层加入Suspense标签
      useSuspense: false,
    },
    lng: initialLanguage,
    fallbackLng: "zh_CN",
    load: "currentOnly",
    backend: {
      loadPath: `/locales/{{lng}}.json`,

    },
  });

export default i18n;
