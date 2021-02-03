import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Input, Modal, Space, Select, Divider } from "antd";
import { useTranslation } from 'react-i18next';
import obyte from "obyte";

import { generateLink } from "utils/generateLink";
import config from "config";
import { QRButton } from "components/QRButton/QRButton";

export const EditRecipientModal = ({
  visible,
  setShowWalletModal,
  id,
  activeWallet,
  deposit_aa,
  current,
}) => {
  const selectRef = useRef(null);
  const { t } = useTranslation();
  const [selectAddress, setSelectAddress] = useState(undefined);
  const [address, setAddress] = useState({
    value: undefined,
    valid: undefined,
  });

  const [recipients, setRecipients] = useState(config.interestRecipients);

  useEffect(() => {
    if (
      recipients.findIndex((r) => r.address === current) !== -1 ||
      current === activeWallet
    ) {
      setSelectAddress(current);
    }
  }, [visible, current, setSelectAddress]); // eslint-disable-line

  const handleChange = (ev) => {
    const value = ev.target.value;
    if (obyte.utils.isValidAddress(value)) {
      setAddress({ value: value, valid: true });
    } else {
      setAddress({ value: value, valid: false });
    }
  };

  const handleCancel = () => {
    setShowWalletModal(false);
    setAddress({ value: undefined, valid: undefined });
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, [visible]);

  const link = generateLink(
    1e4,
    { id, change_interest_recipient: 1, interest_recipient: selectAddress },
    activeWallet,
    deposit_aa
  );
  return (
    <Modal
      visible={visible}
      title={t("modals.edit_recipient.title", "Edit interest recipient")}
      style={{ zIndex: -1 }}
      onCancel={handleCancel}
      footer={
        <Space size={10}>
          <Button key="close" onClick={handleCancel}>
            {t("modals.common.close", "Close")}
          </Button>
          <QRButton
            key="add"
            type="primary"
            disabled={selectAddress === undefined || selectAddress === current}
            href={link}
            onClick={() =>
              setTimeout(() => {
                handleCancel();
              }, 100)
            }
          >
            {t("modals.common.edit", "Edit")}
          </QRButton>
        </Space>
      }
    >
      <Form size="large">
        <Form.Item>
          <Select
            placeholder={t("modals.edit_recipient.select", "Select interest recipient")} 
            value={selectAddress}
            ref={selectRef}
            defaultValue={selectAddress}
            autoFocus={true}
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
                    placeholder={t("modals.edit_recipient.new_address", "Address of the new interest recipient")}
                    value={address.value}
                    onChange={handleChange}
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
                          (r) => r.address === address.value
                        ) === -1 &&
                        address.value !== activeWallet
                      ) {
                        setRecipients((r) => [
                          ...r,
                          {
                            name: address.value,
                            address: address.value,
                          },
                        ]);

                        setSelectAddress(address.value);

                        setAddress({ value: undefined, valid: undefined });
                      }
                    }}
                    disabled={!address.valid}
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
      </Form>
    </Modal>
  );
};
