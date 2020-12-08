import React, { useState, useRef, useEffect } from "react";
import ReactGA from "react-ga";
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  Select,
  Divider,
} from "antd";
import obyte from "obyte";
import { generateLink } from "utils/generateLink";
import { redirect } from "utils/redirect";
import config from "config";

const { Text } = Typography;

export const OpenDepositModal = ({
  visible,
  setVisible,
  asset,
  deposit_aa,
  activeWallet,
  decimals,
  growth_factor,
  new_growth_factor,
  symbol,
}) => {
  const addressInput = useRef(null);
  const { t } = useTranslation();
  const [amount, setAmount] = useState({
    value: undefined,
    valid: undefined,
  });
  const [interestRecipient, setInterestRecipient] = useState({
    value: undefined,
    valid: undefined,
  });

  const [selectAddress, setSelectAddress] = useState(undefined);
  const [recipients, setRecipients] = useState(config.interestRecipients);

  const handleChangeAmount = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;

    if (value === "" || value === "0") {
      setAmount({ value, valid: undefined });
    } else {
      if (
        (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <=
        decimals
      ) {
        if (reg.test(String(value))) {
          setAmount({ value, valid: true });
        } else {
          setAmount({ value, valid: false });
        }
      }
    }
  };

  const handleChangeRecipient = (ev) => {
    const value = ev.target.value;

    if (obyte.utils.isValidAddress(value)) {
      setInterestRecipient({ value, valid: true });
    } else {
      setInterestRecipient({ value, valid: false });
    }
  };

  let validateStatus = "";
  if (amount.valid === true) {
    validateStatus = "success";
  } else if (amount.valid === false) {
    validateStatus = "error";
  } else {
    validateStatus = "";
  }

  const handleCancel = () => {
    setVisible(false);
    setAmount({ value: undefined, valid: undefined });
    setInterestRecipient({ value: undefined, valid: undefined });
  };

  useEffect(() => {
    if (addressInput.current) {
      addressInput.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    setSelectAddress(undefined);
  }, [visible, setSelectAddress]);

  const link = generateLink(
    amount.value * 10 ** decimals,
    selectAddress ? { interest_recipient: selectAddress } : {},
    activeWallet,
    deposit_aa,
    asset,
    true
  );
  const stable_amount = Math.floor(
    amount.value * 10 ** decimals * growth_factor
  );
  const new_stable_amount = Math.floor(
    amount.value * 10 ** decimals * new_growth_factor
  );
  const interest = new_stable_amount - stable_amount;

  return (
    <Modal
      visible={visible}
      title={t("modals.open_deposit.title", "Open deposit")}
      style={{ zIndex: -1 }}
      onCancel={handleCancel}
      footer={
        <Space size={10}>
          <Button key="close" onClick={handleCancel}>
            {t("modals.common.close", "Close")}
          </Button>

          <Button
            key="add"
            type="primary"
            disabled={!amount.valid || Number(amount.value) === 0}
            href={link}
            onClick={() =>
              setTimeout(() => {
                handleCancel();
                ReactGA.event({
                  category: "Stablecoin",
                  action: "Open deposit",
                });
              }, 100)
            }
          >
            {t("modals.common.open", "Open")}
          </Button>
        </Space>
      }
    >
      <Form size="large">
        <Form.Item hasFeedback={true} validateStatus={validateStatus}>
          <Input
            placeholder={t("modals.open_deposit.amount", "Amount of T2 ({{symbol}})", {symbol: symbol || asset})}
            value={amount.value}
            onChange={handleChangeAmount}
            ref={addressInput}
            autoFocus={true}
            suffix={symbol ? symbol : "T2"}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                redirect(link);
                setTimeout(() => {
                  handleCancel();
                }, 100);
              }
            }}
          />
        </Form.Item>

        <Form.Item>
          <Select
            placeholder={t("modals.edit_recipient.select", "Select interest recipient")}
            value={selectAddress}
            onChange={(value) => {
              setSelectAddress(value);
            }}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div
                  style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                >
                  <Input
                    placeholder="Address of the new interest recipient"
                    onChange={handleChangeRecipient}
                    value={interestRecipient.value}
                    style={{ marginRight: 10 }}
                  />
                  <Button
                    style={{
                      flex: "none",
                      padding: "8px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (
                        recipients.findIndex(
                          (r) => r.address === interestRecipient.value
                        ) === -1
                      ) {
                        setRecipients((r) => [
                          ...r,
                          {
                            name: interestRecipient.value,
                            address: interestRecipient.value,
                          },
                        ]);

                        setSelectAddress(interestRecipient.value);

                        setInterestRecipient({
                          value: undefined,
                          valid: undefined,
                        });
                      }
                    }}
                    disabled={!interestRecipient.valid}
                  >
                    {t("modals.edit_recipient.add_your_own", "Add your own")}
                  </Button>
                </div>
              </div>
            )}
          >
            <Select.Option key="Me" value={activeWallet}>
              {t("modals.edit_recipient.me", "Me")}
            </Select.Option>
            {recipients.map((r) => (
              <Select.Option key={r.address} value={r.address}>
                {r.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {amount.valid && Number(amount.value) !== 0 && (
          <p>
            <Text type="secondary">
              {t("modals.open_deposit.will_receive", "in 30 days you will receive ~{{count}} stablecoins", {count: interest / 10 ** decimals})}
            </Text>
          </p>
        )}
      </Form>
    </Modal>
  );
};
