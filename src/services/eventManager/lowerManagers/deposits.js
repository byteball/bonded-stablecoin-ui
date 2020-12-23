import { isEmpty } from "lodash";
import i18n from "../../../locale/index";

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
          i18n.t("notification.deposits.change_recipient.req_author", "You have sent a request to change the interest recipient")
        );
      } else {
        openNotification(
          i18n.t("notification.deposits.change_recipient.req", "Another user sent a request to change the percentage recipient")
        );
      }
    } else if ("id" in payload && "add_protection" in payload) {
      if (isAuthor) {
        openNotification(i18n.t("notification.deposits.add_protection.req_author", "You have sent a request to add protection"));
      } else {
        openNotification(i18n.t("notification.deposits.add_protection.req", "Another user sent a request to add protection"));
      }
    } else if ("id" in payload && "withdraw_protection" in payload) {
      if (isAuthor) {
        openNotification(i18n.t("notification.deposits.withdraw_protection.req_author", "You have sent a request to withdraw protection"));
      } else {
        openNotification(i18n.t("notification.deposits.withdraw_protection.req", "Another user sent a request to withdraw protection"));
      }
    } else if (
      "id" in payload &&
      "challenge_force_close" in payload &&
      "weaker_id" in payload
    ) {
      if (isAuthor) {
        openNotification(i18n.t("notification.deposits.force_close.req_author", "You have sent a request to challenge a force-close"));
      } else {
        openNotification(
          i18n.t("notification.deposits.force_close.req", "Another user sent a request to challenge a force-close")
        );
      }
    } else if ("id" in payload && "commit_force_close" in payload) {
      if (isAuthor) {
        openNotification(i18n.t("notification.deposits.commit_force_close.req_author", "You have sent a request to commit a force close"));
      } else {
        openNotification(
          i18n.t("notification.deposits.commit_force_close.req", "Another user sent a request to commit a force close")
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
          openNotification(i18n.t("notification.deposits.close_deposit.req_author", "You have sent a request to close a Deposit"));
        } else {
          openNotification(i18n.t("notification.deposits.close_deposit.req", "Another user sent a request to close a Deposit"));
        }
      } else {
        if (isAuthor) {
          openNotification(i18n.t("notification.deposits.receive_interest.req_author", "You have sent a request to receive interest"));
        } else {
          openNotification(i18n.t("notification.deposits.receive_interest.req", "Another user sent a request to receive interest"));
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
          openNotification(i18n.t("notification.deposits.open.req_author", "You have sent a request to open a Deposit"));
        } else {
          openNotification(i18n.t("notification.deposits.open.req", "Another user sent a request to open a Deposit"));
        }
      }
    }
  }
};
