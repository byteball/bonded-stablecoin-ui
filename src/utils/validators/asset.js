import i18n from "../../locale/index";

export default (value, onSuccess, onError) => {
  if (value.trim().length === 44 || value.trim() === "base") {
    onSuccess && onSuccess();
    return Promise.resolve();
  } else if (value.trim().length === 0) {
    onError && onError();
    return Promise.reject(i18n.t("validator.required", "This field is required"));
  } else {
    onError && onError();
    return Promise.reject(i18n.t("validator.not_valid", "This field is not valid"));
  }
};
