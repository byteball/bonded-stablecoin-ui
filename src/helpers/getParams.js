export const getParams = (params, stable_state) => {
  const newParams = {};
  for (const param in params) {
    newParams[param] =
      param in stable_state ? stable_state[param] : params[param];
  }
  return newParams;
};
