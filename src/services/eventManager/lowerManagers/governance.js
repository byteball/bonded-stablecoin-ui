import { openNotification } from "utils/openNotification";
import i18n from "../../../locale/index";

export const governanceEventManager = ({
  isReq,
  payload,
  isAuthor,
  governance_state,
}) => {
  const asPercentage = payload.name === "interest_rate" || payload.name === "reporter_share";
  const name = "name" in payload ? payload.name.replace("deposits.", "") : undefined;
  
  if (isReq) {
    if ("commit" in payload && "name" in payload) {
      const leader = governance_state["leader_" + payload.name];
      if (leader) {
        if (isAuthor) {
          openNotification(
            i18n.t("governance.commit.req_author", "You sent a request to commit a new value of {{name}}: {{value}}", {name, value: asPercentage ? leader * 100 + "%" : leader})
          );
        } else {
          openNotification(
            i18n.t("governance.commit.req", "Another user sent a request to commit the new value of {{name}}: {{value}}", {name, value: asPercentage ? leader * 100 + "%" : leader})
          );
        }
      }
    } else if ("name" in payload && "value" in payload) {
      if (isAuthor) {
        openNotification(
          i18n.t("governance.add_support.req_author", "You have sent a request to add support for the {{name}} value of {{value}}", {name, value: asPercentage ? payload.value * 100 + "%" : payload.value})
        );
      } else {
        openNotification(
          i18n.t("governance.add_support.req", "Another user sent a request to add support for the {{name}} value of {{value}}", {name, value: asPercentage ? payload.value * 100 + "%" : payload.value})
        );
      }
    } else if ("withdraw" in payload) {
      if (isAuthor) {
        openNotification(
          i18n.t("governance.withdraw.req_author", "You have sent a request to withdraw your balance from governance")
        );
      } else {
        openNotification(
          i18n.t("governance.withdraw.req", "Another user sent a request to withdraw their balance from governance")
        );
      }
    }
  }
};
