import { UPDATE_SNAPSHOT } from "store/types";
import { changeDepositState } from "../state/changeDepositState";
import { changeGovernanceState } from "../state/changeGovernanceState";
import { changeStableState } from "../state/changeStableState";

export const updateData = (data) => async (dispatch, getState) => {
  const store = getState();
  const { address, deposit_aa, governance_aa } = store.active;

  if (address in data) {
    dispatch(changeStableState(data[address]));
  }

  if (deposit_aa in data) {
    dispatch(changeDepositState(data[deposit_aa]));
  }

  if (governance_aa in data) {
    dispatch(changeGovernanceState(data[governance_aa]));
  }

  dispatch({
    type: UPDATE_SNAPSHOT,
    payload: data
  })
}