import React, { useState } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";

import { WithdrawModal } from "modals/WithdrawModal/WithdrawModal";

export const Withdraw = ({ choiceParams, balance, symbol }) => {
  const [visible, setVisible] = useState(false);
  const { params, stable_state, symbol1, governance_aa } = useSelector(
    (state) => state.active
  );
  const { activeWallet } = useSelector((state) => state.settings);

  return (
    <>
      <p>
        <b>
          Your {symbol || "tokens1"} balance locked in governance Autonomous
          Agent is {balance}
        </b>
      </p>

      {choiceParams.length > 0 && (
        <p>
          For withdraw, you must remove support from these fields:{" "}
          {choiceParams.join(", ")}
        </p>
      )}

      <Button
        disabled={choiceParams.length > 0 || balance === 0}
        type="primary"
        onClick={() => setVisible(true)}
      >
        Withdraw
      </Button>

      <WithdrawModal
        visible={visible}
        setVisible={setVisible}
        asset={stable_state.asset1}
        symbol={symbol1}
        decimals={params.decimals1}
        governance_aa={governance_aa}
        activeWallet={activeWallet}
        max={balance}
      />
    </>
  );
};
