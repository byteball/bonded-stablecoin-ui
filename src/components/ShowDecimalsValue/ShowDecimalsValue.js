import React from "react";
import { Tooltip } from "antd";

export const ShowDecimalsValue = ({ value, decimals }) => {
  if (decimals > 9) {
    return (
      <Tooltip title={Number(value / 10 ** decimals).toFixed(decimals)}>
        <span>{Number(value / 10 ** decimals).toFixed(9) + "..."}</span>
      </Tooltip>
    );
  } else {
    return Number(value / 10 ** decimals).toFixed(decimals);
  }
};
