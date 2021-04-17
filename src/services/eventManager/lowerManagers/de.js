import i18n from "../../../locale/index";

import { openNotification } from "utils/openNotification";
import { getAAPayment } from "../eventManager";
export const deEventManager = ({
  isReq,
  payload,
  isAuthor,
  messages,
  shares_asset,
  reserve_asset,
  symbol4,
  decision_engine_aa,
  reserve_asset_decimals,
  reserve_asset_symbol
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
        const amount = getAAPayment(messages, [decision_engine_aa], reserve_asset) / 10 ** reserve_asset_decimals;
        if (isAuthor) {
          openNotification(
            i18n.t("notification.de.buy.req_author", "You have sent a request to buy {{symbol}} for {{amount}} {{reserve_symbol}}", { symbol: symbol4 || "T_SF", amount, reserve_symbol: reserve_asset_symbol })
          );
        } else {
          openNotification(
            i18n.t("notification.de.buy.req", "Another user sent a request to buy {{symbol}} for {{amount}} {{reserve_symbol}}", { symbol: symbol4 || "T_SF", amount, reserve_symbol: reserve_asset_symbol })
          );
        }
      } else if (action === "redeem") {
        const amount = getAAPayment(messages, [decision_engine_aa], shares_asset) / 10 ** reserve_asset_decimals;
        if (isAuthor) {
          openNotification(
            i18n.t("notification.de.sell.req_author", "You have sent a request to redeem {{amount}} {{symbol}}", { symbol: symbol4 || "T_SF", amount })
          );
        } else {
          openNotification(
            i18n.t("notification.de.sell.req", "Another user sent a request to redeem {{amount}} {{symbol}}", { symbol: symbol4 || "T_SF", amount })
          );
        }
      }
    }
  }
};
