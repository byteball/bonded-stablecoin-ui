import i18n from "../../locale/index";

export default (value, onSuccess, onError) => {
  let error = null;
  const reg = /^[0-9]+$/g;
  if (reg.test(value)) {
    if (Number(value) >= 0 && Number(value) <= 14) {
      onSuccess && onSuccess();
      return Promise.resolve();
    } else {
      error = i18n.t("validator.decimals_range", "Decimals must be between {{from}} and {{to}}", {from: 0, to: 14});
    }
  } else if (value === "") {
    error = i18n.t("validator.required", "This field is required");
  } else {
    if (value.length > 0) {
      error = i18n.t("validator.not_valid", "This field is not valid");
    }
  }
  onError && onError();
  return Promise.reject(error);
};
