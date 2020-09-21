import React, { useState } from "react";
import { Select, Divider, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { AddWalletAddressModal } from "modals/AddWalletAddressModal/AddWalletAddressModal";
import { changeActiveWallet } from "store/actions/settings/changeActiveWallet";

export const SelectWallet = ({ size = "medium", width = 250 }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { wallets, activeWallet } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  return (
    <div>
      <Select
        placeholder="Select your wallet address"
        value={activeWallet}
        size={size}
        style={{ width }}
        optionFilterProp="children"
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Divider style={{ margin: "4px 0" }} />
            <div>
              <Button type="link" onClick={() => setShowWalletModal(true)}>
                Add
              </Button>
            </div>
          </div>
        )}
        onChange={(address) => {
          if (typeof address === "string") {
            dispatch(changeActiveWallet(address));
          }
        }}
      >
        {wallets.map((address, i) => (
          <Select.Option key={"wallet-" + i} value={address}>
            {address}
          </Select.Option>
        ))}
      </Select>

      <AddWalletAddressModal
        visible={showWalletModal}
        setShowWalletModal={setShowWalletModal}
      />
    </div>
  );
};
