export default (
  value,
  onSuccess,
  onError,
  maxValue,
  minValue,
  isInteger,
  maxDecimals
) => {
  let error = null;
  const reg = /^[0-9.]+$/g;
  const int = /^[0-9]+$/g;
  if (value === "") {
    onError && onError();
    return Promise.resolve();
  }
  if (reg.test(value)) {
    if (Number(value) > minValue || minValue === undefined) {
      if (maxValue && Number(value) > maxValue) {
        error = `Max value is ${maxValue}`;
      } else {
        if (isInteger) {
          if (int.test(value)) {
            onSuccess && onSuccess();
            return Promise.resolve();
          } else {
            error = "Value must be an integer";
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
          } else if (maxDecimals === undefined) {
            onSuccess && onSuccess();
            return Promise.resolve();
          } else {
            error = `Max decimals is ${maxDecimals}`;
          }
        }
      }
    } else {
      error = `Min value is ${minValue}`;
    }
  } else {
    error = "This field is not valid";
  }
  onError && onError();
  return Promise.reject(error);
};
