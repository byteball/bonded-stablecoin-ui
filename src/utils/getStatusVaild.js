export const getStatusVaild = (isValid) => {
  if (isValid === undefined) return undefined;
  if (isValid) {
    return "success";
  } else {
    return "error";
  }
};
