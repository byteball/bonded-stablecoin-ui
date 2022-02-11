import { openNotification } from "utils/openNotification";
import { isEmpty } from "lodash";
import i18n from "locale/index";
import moment from "moment";
import { $get_growth_factor } from "helpers/bonded";

export const bondedEventManager = ({
  isReq,
  payload,
  isAuthor,
  messages,
  asset1,
  asset2,
  params,
  symbol1,
  symbol2,
  symbol3,
  stable_aa,
  deposit_aa,
  rate_update_ts,
  interest_rate,
  growth_factor: old_growth_factor
}) => {
  if (isReq) {
    if ("tokens1" in payload || "tokens2" in payload) {
      const { decimals1, decimals2 } = params;
      const isIssueStable = ("tokens2_to" in payload) && ((stable_aa && payload.tokens2_to === stable_aa) || (deposit_aa && payload.tokens2_to === deposit_aa));
      const T1 = payload.tokens1 ? payload.tokens1 / 10 ** decimals1 : 0;
      let T2 = 0;
      let T3 = 0;
      if (isIssueStable) {
        const growth_factor = $get_growth_factor(
          interest_rate,
          moment().unix(),
          rate_update_ts,
          old_growth_factor
        );
        T3 = payload.tokens2 ? Number((payload.tokens2 * growth_factor) / 10 ** decimals2).toFixed(decimals2) : 0;
      } else {
        T2 = payload.tokens2 ? payload.tokens2 / 10 ** decimals2 : 0;
      }

      if (isAuthor) {
        openNotification(
          i18n.t("notification.bonded.buy.req_author", "You have sent a request to buy {{tokens1}} {{tokens2}}", { tokens1: T1 ? T1 + " " + (symbol1 || "T1") : "", tokens2: T3 ? T3 + " " + (symbol3 || "T_STABLE") : (T2 ? T2 + " " + (symbol2 || "T2") : "") })
        );
      } else {
        openNotification(
          i18n.t("notification.bonded.buy.req", "Another user sent a request to buy {{tokens1}} {{tokens2}}", { tokens1: T1 ? T1 + " " + (symbol1 || "T1") : "", tokens2: T3 ? T3 + " " + (symbol3 || "T_STABLE") : (T2 ? T2 + " " + (symbol2 || "T2") : "") })
        );
      }
    } else if (isEmpty(payload)) {
      let type;
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          const asset = msg.payload.asset;
          if (asset === asset1) {
            type = 1;
          } else if (asset === asset2) {
            type = 2;
          }
        }
      }
      if (type) {
        if (isAuthor) {
          openNotification(
            i18n.t("notification.bonded.redeem.req_author", "You have sent a request to redeem {{tokens}}", { tokens: type === 1 ? symbol1 || "T1" : symbol2 || "T2" })
          );
        } else {
          openNotification(
            i18n.t("notification.bonded.redeem.req", "Another user sent a request to redeem {{tokens}}", { tokens: type === 1 ? symbol1 || "T1" : symbol2 || "T2" })
          );
        }
      }
    } else if ("move_capacity" in payload) {
      if (isAuthor) {
        openNotification(
          i18n.t("notification.bonded.move_capacity.req_author", "You have sent a request to move the capacity from slow to fast pool")
        );
      } else {
        openNotification(
          i18n.t("notification.bonded.move_capacity.req", "Another user sent a request to move capacity from a slow pool to a fast pool")
        );
      }
    }
  }
};
