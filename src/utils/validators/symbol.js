import { regSymbol } from "../regSymbol";
import i18n from "../../locale/index";

const reservedTokens = ["TBYTE", "GBYTE", "MBYTE", "KBYTE", "BYTE"];

export default (value, onSuccess, onError) => {
  let error = null;
  if (value.trim().length > 40) {
    error = i18n.t("validator.symbol_max", "Symbol must be max 40 characters long");
  } else if (value.trim().length > 0) {
    if (value === value.toUpperCase()) {
      if (reservedTokens.find((t) => value === t)) {
        error = i18n.t("validator.symbol_reserved", "This symbol name is reserved");
      } else {
        if (value.indexOf(" ") > -1) {
          error = i18n.t("validator.symbol_not_valid", "Symbol is not valid");
        } else {
          if (!regSymbol.test(value)) {
            error = i18n.t("validator.symbol_not_valid", "Symbol is not valid");
          } else {
            onSuccess && onSuccess();
            return Promise.resolve();
          }
        }
      }
    } else {
      error =  error = i18n.t("validator.symbol_uppercase", "Symbol must be uppercase");
    }
  } else {
    error = i18n.t("validator.required", "This field is required");
  }
  onError && onError();
  return Promise.reject(error);
};
