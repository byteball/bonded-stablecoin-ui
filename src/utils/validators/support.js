import i18n from "../../locale/index";

export default (value, onSuccess, onError, maxValue) => {
  let error = null;
  const reg = /^[0-9.]+$/g;
  if (reg.test(value)) {
    if (Number(value) >= 0.1) {
      if (maxValue && Number(value) > maxValue) {
        error = i18n.t("validator.max_support", "Max amount is {{value}} GBYTE", {value: maxValue});
      } else {
        onSuccess && onSuccess();
        return Promise.resolve();
      }
    } else {
      error = i18n.t("validator.min_support", "Min amount is {{value}} GBYTE", {value: 0.1});
    }
  } else {
    error = i18n.t("validator.not_valid", "This field is not valid");
  }
  onError && onError();
  return Promise.reject(error);
};
