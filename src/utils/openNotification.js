import { notification } from "antd";
import i18n from "../locale";

export const openNotification = (message, description) => {
  const args = {
    message,
    description: i18n.t("notification.deposits.will_update", "The interface will update after the transaction is stable"),
    duration: 10,
  };
  notification.open(args);
};
