import React, { useState } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { WithdrawModal } from "modals/WithdrawModal/WithdrawModal";

export const Withdraw = ({ choiceParams, balance, symbol, decimals }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { bonded_state, governance_aa, fund_aa } = useSelector(
    (state) => state.active
  );
  const { activeWallet } = useSelector((state) => state.settings);

  return (
    <>
      <p>
        <b>
          {t("trade.tabs.governance.withdraw.balance", "Your {{symbol}} balance locked in governance Autonomous Agent is {{balance}}.", {balance, symbol: symbol || (fund_aa ? "T_SF" : "T1")})}
        </b>
      </p>

      {choiceParams.length > 0 && (
        <p>
          {t("trade.tabs.governance.withdraw.fields", "To be able to withdraw, you need to remove support from these fields")}:{" "}
          {choiceParams.map((p) => t(`params.${p.replace("deposits.", '')}.name`, p.replace("deposits.", ''))).join(", ").toLowerCase()}.
        </p>
      )}
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
        symbol={symbol}
        decimals={decimals}
        governance_aa={governance_aa}
        activeWallet={activeWallet}
        max={balance}
      />
    </>
  );
};
