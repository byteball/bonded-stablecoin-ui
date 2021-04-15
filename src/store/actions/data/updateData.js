import { UPDATE_SNAPSHOT } from "store/types";
import { updateFundBalance } from "../active/updateFundBalance";
import { changeCarburetorBalance } from "../carburetor/changeCarburetorBalance";
import { changeBondedState } from "../state/changeBondedState";
import { changeDepositState } from "../state/changeDepositState";
import { changeDEState } from "../state/changeDEState";
import { changeFundState } from "../state/changeFundState";
import { changeGovernanceState } from "../state/changeGovernanceState";
import { changeStableState } from "../state/changeStableState";

export const updateData = (state, balances) => async (dispatch, getState) => {
  const store = getState();
  const { address, deposit_aa, governance_aa, fund_aa, stable_aa, bonded_state } = store.active;
  const { address: carburetorAddress } = store.carburetor;

  if (address in state) {
    dispatch(changeBondedState(state[address]));
  }

  if (deposit_aa && (deposit_aa in state)) {
    dispatch(changeDepositState(state[deposit_aa]));
  }

  if (governance_aa in state) {
    dispatch(changeGovernanceState(state[governance_aa]));
  }

  if (carburetorAddress && (carburetorAddress in balances)) {
    dispatch(changeCarburetorBalance(balances[carburetorAddress]))
  }

  if (fund_aa && (fund_aa in state)) {
    dispatch(changeFundState(state[fund_aa]));
  }

  if(fund_aa && (fund_aa in balances)){
    dispatch(updateFundBalance(balances[fund_aa]));
  }

  if (stable_aa && (stable_aa in state)) {
    dispatch(changeStableState(state[stable_aa]));
  }

  if (bonded_state.decision_engine_aa && (bonded_state.decision_engine_aa in state)) {
    dispatch(changeDEState(state[bonded_state.decision_engine_aa]));
  }

  dispatch({
    type: UPDATE_SNAPSHOT,
    payload: { state, balances }
  })
}