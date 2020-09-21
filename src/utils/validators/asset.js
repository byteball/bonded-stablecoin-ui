export default (value, onSuccess, onError) => {
  if (value.trim().length === 44 || value.trim() === "base") {
    onSuccess && onSuccess();
    return Promise.resolve();
  } else if (value.trim().length === 0) {
    onError && onError();
    return Promise.reject("This field is required");
  } else {
    onError && onError();
    return Promise.reject("Asset is not valid!");
  }
};
