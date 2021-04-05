import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import moment from "moment";
import { $get_growth_factor } from "helpers/bonded.js";
import { EditRecipientModal } from "modals/EditRecipientModal/EditRecipientModal";
import { OpenDepositModal } from "modals/OpenDepositModal/OpenDepositModal";
import { getParams } from "helpers/getParams";
import { AddProtectionModal } from "modals/AddProtectionModal/AddProtectionModal";
import { WithdrawProtectionModal } from "modals/WithdrawProtectionModal/WithdrawProtectionModal";
import { WithdrawInterestModal } from "modals/WithdrawInterestModal/WithdrawInterestModal";
import { DepositsInfo } from "./DepositsInfo";
import { DepositsTables } from "./DepositsTables";
import { useGetDeposits } from "./useGetDeposits";

export const Deposits = ({ openWalletModal }) => {
  const [visibleEditRecipient, setVisibleEditRecipient] = useState(false);
  const [visibleOpenDeposit, setVisibleOpenDeposit] = useState(false);
  const [addProtection, setAddProtection] = useState(undefined);
  const [withdrawProtection, setWithdrawProtection] = useState(undefined);
  const [withdrawInterest, setWithdrawInterest] = useState(undefined);
  const {
    deposit_state,
    params,
    deposit_aa,
    bonded_state,
    symbol2,
    symbol3,
  } = useSelector((state) => state.active);
  const { t } = useTranslation();
  const { interest_rate, min_deposit_term, challenge_immunity_period, decimals2, reserve_asset_decimals } = getParams(params, bonded_state);
  const [timestamp, setTimestamp] = useState(moment().unix());
  const { activeWallet } = useSelector((state) => state.settings);
  const [my, all, minProtectionRatio] = useGetDeposits(deposit_state, decimals2, min_deposit_term, challenge_immunity_period, reserve_asset_decimals, activeWallet);
  const growth_factor = $get_growth_factor(
    interest_rate,
    timestamp,
    bonded_state.rate_update_ts,
    bonded_state.growth_factor
  );
  const new_growth_factor = $get_growth_factor(
    interest_rate,
    timestamp + 3600 * 24 * 30,
    bonded_state.rate_update_ts,
    bonded_state.growth_factor
  );

  useEffect(() => {
    const updateTimestamp = setInterval(() => {
      setTimestamp((t) => t + 3);
    }, 3000);
    return () => {
      clearInterval(updateTimestamp);
    };
  }, []);

  if (!activeWallet) {
    return (
      <div style={{ textAlign: "center", cursor: "pointer", color: "#1890ff" }} onClick={openWalletModal}>
        {t("trade.tabs.deposits.no_auth", "Please add the address of your wallet in order to view/open deposits.")}
      </div>
    );
  }

  return (
    <>
      <DepositsInfo
        isActive={interest_rate}
        onOpenDeposit={() => setVisibleOpenDeposit(true)}
        minProtectionRatio={minProtectionRatio}
        asset={deposit_state.asset}
        minDepositTermInHours={+Number(min_deposit_term / 3600).toFixed(2)}
        depositAa={deposit_aa}
        symbol2={symbol2}
        symbol3={symbol3}
      />

      <DepositsTables
        my={my}
        all={all}
        timestamp={timestamp}
        growth_factor={growth_factor}
        new_growth_factor={new_growth_factor}
        minProtectionRatio={minProtectionRatio}
        setVisibleEditRecipient={setVisibleEditRecipient}
        setWithdrawProtection={setWithdrawProtection}
        setAddProtection={setAddProtection}
        setWithdrawInterest={setWithdrawInterest}
      />

      {/* Modals */}
      <EditRecipientModal
        visible={!!visibleEditRecipient}
        id={visibleEditRecipient.id}
        current={visibleEditRecipient.current}
        setShowWalletModal={setVisibleEditRecipient}
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
      />

      <WithdrawProtectionModal
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        visible={withdrawProtection !== undefined}
        deposit={withdrawProtection}
        setVisible={() => setWithdrawProtection(undefined)}
      />

      <WithdrawInterestModal
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        visible={withdrawInterest !== undefined}
        deposit={withdrawInterest}
        symbol3={symbol3}
        decimals2={decimals2}
        setVisible={() => setWithdrawInterest(undefined)}
      />

      <AddProtectionModal
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        visible={addProtection !== undefined}
        deposit={addProtection}
        setVisible={() => setAddProtection(undefined)}
      />

      <OpenDepositModal
        visible={visibleOpenDeposit}
        setVisible={setVisibleOpenDeposit}
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        asset={bonded_state.asset2}
        decimals={decimals2}
        growth_factor={growth_factor}
        new_growth_factor={new_growth_factor}
        symbol={symbol2}
      />
    </>
  );
};
