export default (value, onSuccess, onError, maxValue) => {
  let error = null;
  const reg = /^[0-9.]+$/g;
  if (reg.test(value)) {
    if (Number(value) >= 0.1) {
      if (maxValue && Number(value) > maxValue) {
        error = `Max amount is ${maxValue} GBYTE`;
      } else {
        onSuccess && onSuccess();
        return Promise.resolve();
      }
    } else {
      error = "Min amount is 0.1 GBYTE";
    }
  } else {
    error = "This field is not valid!";
  }
  onError && onError();
  return Promise.reject(error);
};
