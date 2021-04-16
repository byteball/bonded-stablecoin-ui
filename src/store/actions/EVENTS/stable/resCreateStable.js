import { Modal } from "antd";
import i18n from "../../../../locale/index";
import { RESPONSE_ISSUE_STABLECOIN } from "../../../types/pendings";
import { changeActive } from "../../active/changeActive";
import { resetIssueStablecoin } from "../../pendings/resetIssueStablecoin";
import history from "historyInstance.js";
/* eslint eqeqeq: "off" */
export const resCreateStable = ({
  address,
  asset_1,
  asset_2,
  stable_aa,
  deposit_aa,
  governance_aa,
}) => (dispatch, getState, socket) => {
  const addStablecoin = setInterval(async () => {
    let def = false;
    let bonded_state = false;
    let fund_aa;
    let isError = false;

    try {
      def = await socket.api.getDefinition(address);
      bonded_state = await socket.api.getAaStateVars({ address });
      fund_aa = bonded_state?.fund_aa;
    } catch {
      isError = true;
    }

    if (def && bonded_state && (stable_aa || deposit_aa) && !isError) {
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
            stable: stable_aa,
            fund: fund_aa,
            governance: governance_aa,
          },
        },
      });

      const a = def[1].params;
      const p = pendingParam;

      let isEqual =
        a && p && a.decimals1 == p.decimals1 &&
        a.decimals2 == p.decimals2 &&
        a.interest_rate == p.interest_rate &&
        a.feed_name1 === p.feed_name1 &&
        a.op1 === p.op1 &&
        a.m === p.m &&
        a.n === p.n &&
        a.reserve_asset === p.reserve_asset;

      if (pendingParam !== null && isEqual) {
        const modal = Modal.confirm({
          title: i18n.t("notification.create.res", "The stablecoin you created is ready to use, go to it?"),
          okText: i18n.t("notification.create.yes", "Yes"),
          cancelText: i18n.t("notification.create.no", "No"),
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
      }
    }
  }, 1000 * 30);
};
