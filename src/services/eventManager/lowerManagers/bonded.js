import { openNotification } from "utils/openNotification";
import { isEmpty } from "lodash";

export const bondedEventManager = ({
  isReq,
  payload,
  isAuthor,
  messages,
  asset1,
  asset2,
}) => {
  if (isReq) {
    if ("tokens1" in payload || "tokens2" in payload) {
      if (isAuthor) {
        openNotification("You have sent a request to buy stablecoin tokens");
      } else {
        openNotification(
          "Another user sent a request to buy stablecoin tokens"
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
            "You have sent a request to redeem the token " + type
          );
        } else {
          openNotification(
            "Another user sent a request to redeem the token " + type
          );
        }
      }
    } else if ("move_capacity" in payload) {
      if (isAuthor) {
        openNotification(
          "You have sent a request to move the capacity from slow to fast pool"
        );
      } else {
        openNotification(
          "Another user sent a request to move capacity from a slow pool to a fast pool"
        );
      }
    }
  }
};
