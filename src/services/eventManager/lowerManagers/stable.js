import i18n from "../../../locale/index";

import { openNotification } from "utils/openNotification";
export const stableEventManager = ({
  isReq,
  isAuthor,
  messages,
  symbol3,
  asset2,
  asset,
}) => {
  if (isReq) {
    if (messages.find(m => m.app === "payment" && m.payload.asset === asset2)) {
      if (isAuthor) {
        openNotification(
          i18n.t("notification.deposits.buy_stable.req_author", "You have sent a request to buy {{symbol}}", { symbol: symbol3 || "T_STABLE" })
        );
      } else {
        openNotification(
          i18n.t("notification.deposits.buy_stable.req", "Another user sent a request to buy {{symbol}}", { symbol: symbol3 || "T_STABLE" })
        );
      }
    } else if (messages.find(m => m.app === "payment" && m.payload.asset === asset)) {
        if (isAuthor) {
          openNotification(
            i18n.t("notification.deposits.sell_stable.req_author", "You have sent a request to sell {{symbol}}", { symbol: symbol3 || "T_STABLE" })
          );
        } else {
          openNotification(
            i18n.t("notification.deposits.sell_stable.req", "Another user sent a request to sell {{symbol}}", { symbol: symbol3 || "T_STABLE" })
          );
        }
    }
  }
};
