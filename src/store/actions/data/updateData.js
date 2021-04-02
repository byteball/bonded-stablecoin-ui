import { UPDATE_SNAPSHOT } from "store/types";
import { changeCarburetorBalance } from "../carburetor/changeCarburetorBalance";
import { changeDepositState } from "../state/changeDepositState";
import { changeGovernanceState } from "../state/changeGovernanceState";
import { changeStableState } from "../state/changeStableState";

export const updateData = (state, balances) => async (dispatch, getState) => {
  const store = getState();
  const { address, deposit_aa, governance_aa } = store.active;
  const { address: carburetorAddress } = store.carburetor;

  if (address in state) {
    dispatch(changeStableState(state[address]));
  }

  if (deposit_aa in state) {
    dispatch(changeDepositState(state[deposit_aa]));
  }

  if (governance_aa in state) {
    dispatch(changeGovernanceState(state[governance_aa]));
  }

  if (carburetorAddress && (carburetorAddress in balances)) {
    dispatch(changeCarburetorBalance(balances[carburetorAddress]))
  }

  dispatch({
    type: UPDATE_SNAPSHOT,
    payload: { state, balances }
  })
}