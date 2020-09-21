import { isEmpty } from "lodash";

import { openNotification } from "utils/openNotification";

export const depositsEventManager = ({
  isReq,
  payload,
  isAuthor,
  messages,
  asset2,
}) => {
  if (isReq) {
    if ("id" in payload && "change_interest_recipient" in payload) {
      if (isAuthor) {
        openNotification(
          "You have sent a request to change the interest recipient"
        );
      } else {
        openNotification(
          "Another user sent a request to change the percentage recipient"
        );
      }
    } else if ("id" in payload && "add_protection" in payload) {
      if (isAuthor) {
        openNotification("You have sent a request to add protection");
      } else {
        openNotification("Another user sent a request to add protection");
      }
    } else if ("id" in payload && "withdraw_protection" in payload) {
      if (isAuthor) {
        openNotification("You have sent a request to withdraw protection");
      } else {
        openNotification("Another user sent a request to withdraw protection");
      }
    } else if (
      "id" in payload &&
      "challenge_force_close" in payload &&
      "weaker_id" in payload
    ) {
      if (isAuthor) {
        openNotification("You have sent a request to challenge a force-close");
      } else {
        openNotification(
          "Another user sent a request to challenge a force-close"
        );
      }
    } else if ("id" in payload && "commit_force_close" in payload) {
      if (isAuthor) {
        openNotification("You have sent a request to to commit a force close");
      } else {
        openNotification(
          "Another user sent a request to to commit a force close"
        );
      }
    } else if ("id" in payload) {
      let type;
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          type = 1;
        }
      }

      if (type === 1) {
        if (isAuthor) {
          openNotification("You have sent a request to close a Deposit");
        } else {
          openNotification("Another user sent a request to close a Deposit");
        }
      } else {
        if (isAuthor) {
          openNotification("You have sent a request to receive interest");
        } else {
          openNotification("Another user sent a request to receive interest");
        }
      }
    } else if (isEmpty(payload)) {
      let isInterestAsset = false;
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          const asset = msg.payload.asset;
          if (asset === asset2) {
            isInterestAsset = true;
          }
        }
      }
      if (isInterestAsset) {
        if (isAuthor) {
          openNotification("You have sent a request to open a Deposit");
        } else {
          openNotification("Another user sent a request to open a Deposit");
        }
      }
    }
  }
};
