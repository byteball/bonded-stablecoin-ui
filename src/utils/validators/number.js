import i18n from "../../locale/index";

export default (
  value,
  onSuccess,
  onError,
  maxValue,
  minValue,
  isInteger,
  maxDecimals,
  canBeNegative
) => {
  let error = null;
  const reg = canBeNegative ? /^-?[+0-9.]+$/g : /^[0-9.]+$/g;
  const int = /^[0-9]+$/g;
  if (value === "") {
    onError && onError();
    return Promise.resolve();
  }
  if (reg.test(value)) {
    if (Number(value) > minValue || minValue === undefined) {
      if (maxValue && Number(value) > maxValue) {
        error = i18n.t("validator.max_value", "Max value is {{value}}", {value: maxValue});
      } else {
        if (isInteger) {
          if (int.test(value)) {
            onSuccess && onSuccess();
            return Promise.resolve();
          } else {
            error = i18n.t("validator.integer", "Value must be an integer");
          }
        } else {
          if (
            maxDecimals &&
            (~(value + "").indexOf(".")
              ? (value + "").split(".")[1].length
              : 0) <= maxDecimals
          ) {
            onSuccess && onSuccess();
            return Promise.resolve();
          } else if (!maxDecimals) {
            onSuccess && onSuccess();
            return Promise.resolve();
          } else {
            error = i18n.t("validator.max_decimals", "Max decimals is {{value}}", {value: maxDecimals});
          }
        }
      }
    } else {
      error = i18n.t("validator.min_value", "Min value is {{value}}", {value: minValue});
    }
  } else {
    error = i18n.t("validator.not_valid", "This field is not valid");
  }
  onError && onError();
  return Promise.reject(error);
};
