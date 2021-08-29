const initDepositParams = {
  min_deposit_term: 2 * 3600,
  challenging_period: 12 * 3600,
  challenge_immunity_period: 3600,
  reporter_share: 0.2,
}

export const getParams = (params, bonded_state) => {
  const newParams = {};
  const deposit_params = { ...initDepositParams, ...bonded_state.deposit_params };

  for (const param in params) {
    newParams[param] =
      param in bonded_state ? bonded_state[param] : params[param];
  }

  if("oracles" in bonded_state){
    newParams.oracles = bonded_state.oracles
  }

  if ("decision_engine_aa" in bonded_state){
    newParams.decision_engine_aa = bonded_state.decision_engine_aa
  }
  
  return { sf_capacity_share: 0, ...deposit_params, ...newParams }
};
