import i18n from "../../../locale/index";

import { openNotification } from "utils/openNotification";
export const deEventManager = ({
  isReq,
  payload,
  isAuthor,
  messages,
  shares_asset,
  symbol4,
  decision_engine_aa,
  reserve_asset_decimals,
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
        const count = messages.find((msg) => msg.app === "payment" && ("asset" in msg.payload))?.payload?.outputs?.find((output) => output.address === decision_engine_aa).amount / 10 ** reserve_asset_decimals;
        if (isAuthor) {
          openNotification(
            i18n.t("notification.de.sell.req_author", "You have sent a request to redeem {{count}} {{symbol}}", { symbol: symbol4 || "T_SF", count })
          );
        } else {
          openNotification(
            i18n.t("notification.de.sell.req", "Another user sent a request to redeem {{count}} {{symbol}}", { symbol: symbol4 || "T_SF", count })
          );
        }
      }
    }
  }
};
