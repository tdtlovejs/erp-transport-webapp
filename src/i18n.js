import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import 'moment/locale/vi';
import translations_en from "./translations/en/translates";
import translations_vi from "./translations/vi/translates";
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next'
import {LOCAL_LANGUAGE, SUPPORTED_LOCALES} from "./constants/constants";

export const LANGUAGE_FR = "fr";
export const DEFAULT_LANGUAGE =  process.env.REACT_APP_DEFAULT_LOCALE;
const arrayLanguages = SUPPORTED_LOCALES
let cookieLanguage = Cookies.get(LOCAL_LANGUAGE) ?Cookies.get(LOCAL_LANGUAGE) : Cookies.get("i18nextLng") &&  arrayLanguages.includes(Cookies.get("i18nextLng")) ? Cookies.get("i18nextLng") :DEFAULT_LANGUAGE;
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs:arrayLanguages,
        lng:cookieLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        debug: false,

        ns:["translations"],
        defaultNS: "translations",
        interpolation: {
            escapeValue: false // not needed for react!!
        },
        resources: {
            en: {
                translations: translations_en,
            },
            vi: {
                translations: translations_vi,
            }
        },
        react: {
            wait: false,
            useSuspense: false
        }
    }).then(r =>{
});

export default i18n;
