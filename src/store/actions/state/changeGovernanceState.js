import { CHANGE_GOVERNANCE_STATE } from "../../types/state";

export const changeGovernanceState = (state) => ({
  type: CHANGE_GOVERNANCE_STATE,
  payload: state,
});
