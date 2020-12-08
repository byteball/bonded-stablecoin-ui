import { CHANGE_LANGUAGE } from "store/types";

export const changeLanguage = (lang) =>({
  type: CHANGE_LANGUAGE,
  payload: lang
})