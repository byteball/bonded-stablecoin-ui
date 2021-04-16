import i18n from "../../../locale/index";

import { openNotification } from "utils/openNotification";
export const deEventManager = ({
  isReq,
  payload,
  isAuthor,
  messages,
  shares_asset,
  symbol4,
}) => {
  if (isReq) {
    if ("act" in payload) {
      if (isAuthor) {
        openNotification(
          i18n.t("notification.de.fix.req_author", "You have sent a request to fix the price")
        );
      } else {
        openNotification(
          i18n.t("notification.de.fix.req", "Another user sent a request to fix the price")
        );
      }
    } else {
      let action; // "buy" or "redeem"
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          const assetInPayload = msg.payload.asset;
          if (assetInPayload === shares_asset) {
            action = "redeem"
          }
        } else {
          action = "buy"
        }
      }
      if (action === "buy") {
        if (isAuthor) {
          openNotification(
            i18n.t("notification.de.buy.req_author", "You have sent a request to buy {{symbol}}", { symbol: symbol4 || "T_SF" })
          );
        } else {
          openNotification(
            i18n.t("notification.de.buy.req", "Another user sent a request to buy {{symbol}}", { symbol: symbol4 || "T_SF" })
          );
        }
      } else if (action === "redeem") {
        if (isAuthor) {
          openNotification(
            i18n.t("notification.de.sell.req_author", "You have sent a request to redeem {{symbol}}", { symbol: symbol4 || "T_SF" })
          );
        } else {
          openNotification(
            i18n.t("notification.de.sell.req", "Another user sent a request to redeem {{symbol}}", { symbol: symbol4 || "T_SF" })
          );
        }
      }
    }
  }
};
