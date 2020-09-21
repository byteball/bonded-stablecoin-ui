import { PENDING_ISSUE_STABLECOIN } from "../../types/pendings";
import { pickBy } from "lodash";

export const pendingIssue = (params) => ({
  type: PENDING_ISSUE_STABLECOIN,
  payload: pickBy(params, (p) => p !== undefined),
});
