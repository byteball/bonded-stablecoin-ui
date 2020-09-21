import { openNotification } from "utils/openNotification";

export const governanceEventManager = ({
  isReq,
  payload,
  isAuthor,
  governance_state,
}) => {
  const i = payload.name === "interest_rate";
  if (isReq) {
    if ("commit" in payload && "name" in payload) {
      const leader = governance_state["leader_" + payload.name];
      if (leader) {
        if (isAuthor) {
          openNotification(
            `You sent a request to commit a new value of ${payload.name}: ${
              i ? leader * 100 + "%" : leader
            }`
          );
        } else {
          openNotification(
            `Another user sent a request to commit the new value of ${
              payload.name
            }: ${i ? leader * 100 + "%" : leader}`
          );
        }
      }
    } else if ("name" in payload && "value" in payload) {
      if (isAuthor) {
        openNotification(
          `You have sent a request to add support for the  ${
            payload.name
          } value of ${i ? payload.value * 100 + "%" : payload.value}`
        );
      } else {
        openNotification(
          `Another user sent a request to add support for the ${
            payload.name
          } value of ${i ? payload.value * 100 + "%" : payload.value}`
        );
      }
    } else if ("withdraw" in payload) {
      if (isAuthor) {
        openNotification(
          "You have sent a request to withdraw your balance from governance"
        );
      } else {
        openNotification(
          "Another user sent a request to withdraw their balance from governance"
        );
      }
    }
  }
};
