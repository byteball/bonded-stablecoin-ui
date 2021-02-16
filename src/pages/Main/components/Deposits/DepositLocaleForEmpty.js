import React from "react";
import { useTranslation, Trans } from 'react-i18next';
import { Button } from "antd";

export const DepositLocaleForEmpty = ({ isActive, onOpenDeposit }) => {
  const { t } = useTranslation();
  if (isActive) {
    return <Trans i18nKey="trade.tabs.deposits.for_empty">
      You don't have any open deposits, please{" "}
      <Button
        type="link"
        style={{ padding: 0 }}
        onClick={onOpenDeposit}
      >
        open a new one
      </Button>{" "}
      or change your wallet address.
    </Trans>
  } else {
    return t("trade.tabs.deposits.disabled", "Deposits are disabled when there is no interest rate.")
  }
}