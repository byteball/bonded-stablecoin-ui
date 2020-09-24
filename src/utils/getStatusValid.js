export const getStatusValid = (isValid) => {
  if (isValid === undefined) return undefined;
  if (isValid) {
    return "success";
  } else {
    return "error";
  }
};
