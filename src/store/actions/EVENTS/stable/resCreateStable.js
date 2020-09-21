import { Modal } from "antd";

import { RESPONSE_ISSUE_STABLECOIN } from "../../../types/pendings";
import { changeActive } from "../../active/changeActive";
import { resetIssueStablecoin } from "../../pendings/resetIssueStablecoin";
import history from "historyInstance.js";
/* eslint eqeqeq: "off" */
export const resCreateStable = ({
  address,
  asset_1,
  asset_2,
  deposit_aa,
  governance_aa,
}) => (dispatch, getState, socket) => {
  const addStablecoin = setInterval(async () => {
    let def = false;
    let stable_state = false;
    let deposit_state = false;
    let governance_state = false;
    let isError = false;
    try {
      def = await socket.api.getDefinition(address);
      deposit_state = await socket.api.getAaStateVars({ address: deposit_aa });
      governance_state = await socket.api.getAaStateVars({
        address: governance_aa,
      });
      stable_state = await socket.api.getAaStateVars({ address });
    } catch {
      isError = true;
    }
    if (def && stable_state && deposit_state && governance_state && !isError) {
      const store = getState();
      const pendingParam = store.pendings.stablecoin.params;
      clearInterval(addStablecoin);
      dispatch({
        type: RESPONSE_ISSUE_STABLECOIN,
        payload: {
          address,
          data: {
            reserve: 0,
            symbol: null,
            params: def[1].params,
            address,
            asset_1,
            asset_2,
            deposit: deposit_aa,
            governance: governance_aa,
          },
        },
      });
      const a = def[1].params;
      const p = def[1].params;
      let isEqual =
        a.decimals1 == p.decimals1 &&
        a.decimals2 == p.decimals2 &&
        a.interest_rate == p.interest_rate &&
        a.feed_name1 === p.feed_name1 &&
        a.op1 === p.op1 &&
        a.m === p.m &&
        a.n === p.n &&
        a.reserve_asset === p.reserve_asset;

      if (pendingParam !== null && isEqual) {
        const modal = Modal.confirm({
          title: "The stablecoin you created is ready to use, go to it?",
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            dispatch(changeActive(address));
            modal.destroy();
            history.push("/trade/");
          },
          onCancel: () => {
            dispatch(resetIssueStablecoin());
            modal.destroy();
          },
        });
      } else {
      }
    }
  }, 1000 * 30);
};
