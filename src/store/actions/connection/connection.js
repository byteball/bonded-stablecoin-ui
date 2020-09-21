import { OPEN_CONNECTION, CLOSE_CONNECTION } from "../../types";

export const openConnection = () => ({ type: OPEN_CONNECTION });
export const closeConnection = () => ({ type: CLOSE_CONNECTION });
