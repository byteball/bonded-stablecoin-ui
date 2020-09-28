import React from "react";
import { Tooltip } from "antd";
import { Decimal as DecimalDefault } from "decimal.js";
const BigDecimal = DecimalDefault.clone({ precision: 15, toExpNeg: -14 });

export const ShowDecimalsValue = ({ value, decimals }) => {
  if (decimals > 9) {
    return (
      <Tooltip title={Number(value / 10 ** decimals).toFixed(decimals)}>
        <span>{Number(value / 10 ** decimals).toFixed(9) + "..."}</span>
      </Tooltip>
    );
  } else {
    return new BigDecimal(value / 10 ** decimals).toString();
  }
};
