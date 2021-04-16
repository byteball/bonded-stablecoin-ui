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
  const label = getTokenLabelByType(type);
  if (isReq) {
    const { symbol, asset } = payload;

    if (isAuthor) {
      openNotification(
        i18n.t("notification.tokens.req_author", "You sent a request to create a token symbol {{symbol}} for {{token}}", { symbol, token: label })
      );
    } else {
      openNotification(
        i18n.t("notification.tokens.req", "Another user sent a request to create a token symbol {{symbol}} for {{token}}", { symbol, token: label })
      );
    }

    store.dispatch(reqCreateToken({ symbol, asset, type, isAuthor }));
  } else if (isRes) {
    openNotification(
      i18n.t("notification.tokens.res", "The symbol for {{token}} was registered", { token: label })
    );

    store.dispatch(resCreateToken({ symbol: response.symbol, type }));
  }
};

export const getTokenLabelByType = (type) => {
  if (type === 1 || type === 2) {
    return `T${type}`
  } else if (type === 3) {
    return "stable token"
  } else if (type === 4) {
    return "stability fund token"
  }
}