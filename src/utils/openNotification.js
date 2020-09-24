import { notification } from "antd";

export const openNotification = (message, description) => {
  const args = {
    message,
    description: "The interface will update after the transaction is stable",
    duration: 10,
  };
  notification.open(args);
};
