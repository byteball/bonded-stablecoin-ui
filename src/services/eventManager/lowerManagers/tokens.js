import { store } from "index";
import { openNotification } from "utils/openNotification";
import { reqCreateToken } from "store/actions/EVENTS/tokens/reqCreateToken";
import { resCreateToken } from "store/actions/EVENTS/tokens/resCreateToken";
import i18n from "../../../locale/index";

export const tokensEventManager = async ({
  isReq,
  response,
  isRes,
  payload,
  isAuthor,
  type,
}) => {
  if (isReq) {
    const { symbol, asset } = payload;

    if (isAuthor) {
      openNotification(
        i18n.t("notification.tokens.req_author", "You sent a request to create a token symbol {{symbol}} for {{token}}", {symbol, token: type !== 3 ? `T${type}` : "stable token"})
      );
    } else {
      openNotification(
        i18n.t("notification.tokens.req", "Another user sent a request to create a token symbol {{symbol}} for {{token}}", {symbol, token: type !== 3 ? `T${type}` : "stable token"})
      );
    }

    store.dispatch(reqCreateToken({ symbol, asset, type, isAuthor }));
  } else if (isRes) {
    openNotification(
      i18n.t("notification.tokens.res", "The symbol for {{token}} was registered", {token: type === 3 ? "stable token" : "T" + type})
    );

    store.dispatch(resCreateToken({ symbol: response.symbol, type }));
  }
};
