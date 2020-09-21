import { regSymbol } from "../regSymbol";

const reservedTokens = ["TBYTE", "GBYTE", "MBYTE", "KBYTE", "BYTE"];

export default (value, onSuccess, onError) => {
  let error = null;
  if (value.trim().length > 40) {
    error = "Symbol must be max 40 characters long";
  } else if (value.trim().length > 0) {
    if (value === value.toUpperCase()) {
      if (reservedTokens.find((t) => value === t)) {
        error = "This symbol name is reserved";
      } else {
        if (value.indexOf(" ") > -1) {
          error = "Symbol is not valid";
        } else {
          if (!regSymbol.test(value)) {
            error = "Symbol is not valid";
          } else {
            onSuccess && onSuccess();
            return Promise.resolve();
          }
        }
      }
    } else {
      error = "Symbol must be uppercase";
    }
  } else {
    error = "This field is required";
  }
  onError && onError();
  return Promise.reject(error);
};
