import React from "react";
import { Modal } from "antd";
import { useTranslation, Trans } from 'react-i18next';

import { generateLink } from "utils/generateLink";
import { QRButton } from "components/QRButton/QRButton";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";

export const WithdrawInterestModal = ({
  visible,
  setVisible,
  deposit_aa,
  symbol3,
  decimals2,
  activeWallet,
  deposit = {},
}) => {
  const { id } = deposit;
  const { t } = useTranslation();

  return (
    <Modal
      warning
      visible={visible}
      title={null}
      onCancel={setVisible}
      style={{ zIndex: -1 }}
      bodyStyle={{ paddingTop: 40 }}
      footer={null}
    >
      <Trans i18nKey="modals.withdraw_interest.desc">
        <p>Confirm withdrawal of <ShowDecimalsValue decimals={decimals2} value={deposit.interest} /> {{symbol3}}. The deposit will continue accruing interest as before.</p>
      </Trans>
      <QRButton
        type="primary"
        onClick={() =>
          setTimeout(() => {
            setVisible();
          }, 100)
        }
        href={generateLink(
          1e4,
          { id },
          activeWallet,
          deposit_aa
        )}
      >
        {t("modals.withdraw_interest.btn", "Withdraw interest")}
      </QRButton>
    </Modal>
  );
};
