const initDepositParams = {
  min_deposit_term: 2 * 3600,
  challenging_period: 12 * 3600,
  challenge_immunity_period: 3600,
  reporter_share: 0.2,
}

export const getParams = (params, stable_state) => {
  const newParams = {};
  const deposit_params = { ...initDepositParams, ...stable_state.deposit_params };

  for (const param in params) {
    newParams[param] =
      param in stable_state ? stable_state[param] : params[param];
  }

  if("oracles" in stable_state){
    newParams.oracles = stable_state.oracles
  }
  
  return { ...deposit_params, ...newParams }
};
