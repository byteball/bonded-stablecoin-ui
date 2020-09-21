export default (value, onSuccess, onError) => {
  let error = null;
  const reg = /^[0-9]+$/g;
  if (reg.test(value)) {
    if (Number(value) >= 0 && Number(value) <= 14) {
      onSuccess && onSuccess();
      return Promise.resolve();
    } else {
      error = "Decimals must be between 0 and 14";
    }
  } else if (value === "") {
    error = "This field is required";
  } else {
    if (value.length > 0) {
      error = "Decimals field is not valid!";
    }
  }
  onError && onError();
  return Promise.reject(error);
};
