import i18n from "../../../locale/index";
import moment from "moment";
import { openNotification } from "utils/openNotification";
import { $get_growth_factor } from "helpers/bonded";

export const stableEventManager = ({
  isReq,
  isAuthor,
  messages,
  symbol3,
  stable_aa,
  decimals2,
  asset2,
  asset,
  rate_update_ts,
  interest_rate,
  growth_factor: old_growth_factor
}) => {
  if (isReq) {
    const messageWithAsset2 = messages.find(m => m.app === "payment" && m.payload.asset === asset2);
    const messageWithStableAsset = messages.find(m => m.app === "payment" && m.payload.asset === asset);
    if (messageWithAsset2) {
      const timestamp = moment().unix();
      const output = messageWithAsset2?.payload?.outputs?.find(o => o.address === stable_aa);
      const asset2Amount = output.amount / 10 ** decimals2;
      const growth_factor = $get_growth_factor(
        interest_rate,
        timestamp,
        rate_update_ts,
        old_growth_factor
      );
      const stableAssetAmount = Number(asset2Amount * growth_factor).toFixed(decimals2);

      if (isAuthor) {
        openNotification(
          i18n.t("notification.deposits.buy_stable.req_author", "You have sent a request to buy {{count}} {{symbol}}", { symbol: symbol3 || "T_STABLE", count: stableAssetAmount })
        );
      } else {
        openNotification(
          i18n.t("notification.deposits.buy_stable.req", "Another user sent a request to buy {{count}} {{symbol}}", { symbol: symbol3 || "T_STABLE", count: stableAssetAmount })
        );
      }
    } else if (messageWithStableAsset) {
      const output = messageWithStableAsset?.payload?.outputs?.find(o => o.address === stable_aa);
      const stableAssetAmount = output.amount / 10 ** decimals2;
      if (isAuthor) {
        openNotification(
          i18n.t("notification.deposits.sell_stable.req_author", "You have sent a request to sell {{count}} {{symbol}}", { symbol: symbol3 || "T_STABLE", count: stableAssetAmount })
        );
      } else {
        openNotification(
          i18n.t("notification.deposits.sell_stable.req", "Another user sent a request to sell {{count}} {{symbol}}", { symbol: symbol3 || "T_STABLE", count: stableAssetAmount })
        );
      }
    }
  }
};
