import React from "react"
import { Button } from "antd";
import { useTranslation } from 'react-i18next';

import historyInstance from "historyInstance";

export const ButtonEditParams = ({ param, address }) => {
  
  const { t } = useTranslation();

  return (
    <Button type="link" style={{ padding: 0, margin: 0, height: "auto" }} onClick={() => {
      if (param) {
        historyInstance.push(`/trade/${address}/governance#${param}`);
      }
    }}>({t("trade.tabs.parameters.edit", "edit")})</Button>
  )
};