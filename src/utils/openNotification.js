import { notification } from "antd";

export const openNotification = (message, description) => {
  const args = {
    message,
    duration: 10,
  };
  notification.open(args);
};
