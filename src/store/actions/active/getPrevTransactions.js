import { LOAD_PREV_TRANSACTIONS } from "store/types";

export const getPrevTransactions = () => async (dispatch, getState, socket) => {

  const store = getState();
  const { active: { address, deposit_aa, governance_aa } } = store;

  const curveResponses = await socket.api.getAaResponses({
    aa: address
  });

  const depositResponses = await socket.api.getAaResponses({
    aa: deposit_aa
  });

  const governanceResponses = await socket.api.getAaResponses({
    aa: governance_aa
  });

  const curveGetTransactions = curveResponses.map((t) => {
    const unitInfo = socket.api.getJoint(t.trigger_unit).then((info) => {
      const { joint: { unit } } = info;
      return {
        trigger_unit: t.trigger_unit,
        unit,
        bounced: t.bounced,
        trigger_address: t.trigger_address,
        objResponseUnit: t.objResponseUnit
      }
    });
    return unitInfo;
  });

  const depositGetTransactions = depositResponses.map((t) => {
    const unitInfo = socket.api.getJoint(t.trigger_unit).then((info) => {
      const { joint: { unit } } = info;
      return {
        trigger_unit: t.trigger_unit,
        unit,
        bounced: t.bounced,
        trigger_address: t.trigger_address,
        objResponseUnit: t.objResponseUnit
      }
    });
    return unitInfo;
  });

  const governanceGetTransactions = governanceResponses.map((t) => {
    const unitInfo = socket.api.getJoint(t.trigger_unit).then((info) => {
      const { joint: { unit } } = info;
      return {
        trigger_unit: t.trigger_unit,
        unit,
        bounced: t.bounced,
        trigger_address: t.trigger_address,
        objResponseUnit: t.objResponseUnit
      }
    });
    return unitInfo;
  });
  
  const curveUnits = {};
  const depositUnits = {};
  const governanceUnits = {};

  const curveTransactions = await Promise.all(curveGetTransactions);
  const depositTransactions = await Promise.all(depositGetTransactions);
  const governanceTransactions = await Promise.all(governanceGetTransactions);

  curveTransactions.forEach(({ trigger_unit, unit, bounced, trigger_address, objResponseUnit }) => {
    curveUnits[trigger_unit] = { ...unit, bounced, isStable: true, trigger_address, objResponseUnit: objResponseUnit || {} };
  });

  depositTransactions.forEach(({ trigger_unit, unit, bounced, trigger_address, objResponseUnit }) => {
    depositUnits[trigger_unit] = { ...unit, bounced, isStable: true, trigger_address,objResponseUnit: objResponseUnit || {} };
  });

  governanceTransactions.forEach(({ trigger_unit, unit, bounced, trigger_address, objResponseUnit }) => {
    governanceUnits[trigger_unit] = { ...unit, bounced, isStable: true, trigger_address, objResponseUnit: objResponseUnit || {} };
  });

  dispatch({
    type: LOAD_PREV_TRANSACTIONS,
    payload: { curveUnits, depositUnits, governanceUnits }
  })

}