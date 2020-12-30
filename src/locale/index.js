import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./ru.json"
import es from "./es-ES.json"
import zh from "./zh-CN.json"
import da from "./da-DK.json"
// import  translations  from "./translations";
// the translations
// (tip move them in a JSON file and import them)

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      ru: {
        translation: ru
      },
      es: {
        translation: es
      },
      zh: {
        translation: zh
      },
      da: {
        translation: da
      },
    },
    lng: "en",
    keySeparator: ".", // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;