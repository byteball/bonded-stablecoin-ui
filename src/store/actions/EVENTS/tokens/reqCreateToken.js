import config from "config";
import { EVENT_PENDING_TOKEN } from "../../../types/events";

export const reqCreateToken = ({ symbol, asset, type, isAuthor }) => async (
  dispatch,
  getState,
  socket
) => {
  if (isAuthor) {
    dispatch({ type: EVENT_PENDING_TOKEN, payload: { type } });
  } else {
    const asset = await socket.api.getAssetBySymbol(
      config.TOKEN_REGISTRY,
      symbol
    );
    if (!asset) {
      dispatch({ type: EVENT_PENDING_TOKEN, payload: { type } });
    }
  }
};
