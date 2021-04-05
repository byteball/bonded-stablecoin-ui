import React, { useState } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { WithdrawModal } from "modals/WithdrawModal/WithdrawModal";

export const Withdraw = ({ choiceParams, balance, symbol }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { params, bonded_state, symbol1, governance_aa } = useSelector(
    (state) => state.active
  );
  const { activeWallet } = useSelector((state) => state.settings);

  return (
    <>
      <p>
        <b>
          {t("trade.tabs.governance.withdraw.balance", "Your {{symbol}} balance locked in governance Autonomous Agent is {{balance}}.", {balance, symbol: symbol || "T1"})}
        </b>
      </p>

      {choiceParams.length > 0 && (
        <p>
          {t("trade.tabs.governance.withdraw.fields", "To be able to withdraw, you need to remove support from these fields")}:{" "}
          {choiceParams.map((p) => t(`params.${p.replace("deposits.", '')}.name`, p.replace("deposits.", ''))).join(", ").toLowerCase()}.
        </p>
      )}
      {/* {t("trade.tabs.parameters." + choiceParams).join(", ")}. */}
      <Button
        disabled={choiceParams.length > 0 || balance === 0}
        type="primary"
        onClick={() => setVisible(true)}
      >
        {t("trade.tabs.governance.withdraw.withdraw", "Withdraw")}
      </Button>

      <WithdrawModal
        visible={visible}
        setVisible={setVisible}
        asset={bonded_state.asset1}
        symbol={symbol1}
        decimals={params.decimals1}
        governance_aa={governance_aa}
        activeWallet={activeWallet}
        max={balance}
      />
    </>
  );
};
