import React from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

export const Label = ({
  label,
  descr,
  required = false,
  type = "attention",
}) => {
  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span style={{ paddingRight: 5 }}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </span>
      <Tooltip title={descr}>
        <InfoCircleOutlined />
      </Tooltip>
    </span>
  );
};
