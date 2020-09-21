import { store } from "index";
import { openNotification } from "utils/openNotification";
import { reqCreateToken } from "store/actions/EVENTS/tokens/reqCreateToken";
import { resCreateToken } from "store/actions/EVENTS/tokens/resCreateToken";

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
        `You sent a request to create a token symbol ${symbol} for ${
          type !== 3 ? `token${type}` : "stable token"
        }`
      );
    } else {
      openNotification(
        `Another user sent a request to create a token symbol ${symbol} for ${
          type !== 3 ? `token${type}` : "stable token"
        }`
      );
    }

    store.dispatch(reqCreateToken({ symbol, asset, type, isAuthor }));
  } else if (isRes) {
    openNotification(
      `The symbol for ${type === 3 && "stable"} token ${
        type !== 3 && type
      } was registered`
    );

    store.dispatch(resCreateToken({ symbol: response.symbol, type }));
  }
};
