/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import obyte from "obyte";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import socket from "services/socket";

import history from "../../historyInstance";
import { changeActive } from "store/actions/active/changeActive";
import config from "config";

export const HashHandler = ({ children }) => {
  const { loaded, data } = useSelector((state) => state.list);
  const { address } = useSelector((state) => state.active);
  const { recent } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    const splitUrl = history.location.pathname.split("/").slice(1);

    (async () => {
      if (loaded) {
        if (
          splitUrl[0] === "trade" &&
          splitUrl[1] !== "" && 
          splitUrl[1] !== undefined
        ) {
          const symbolOrAddress = splitUrl[1];
          if (obyte.utils.isValidAddress(symbolOrAddress)) {
            if (address !== symbolOrAddress) {
              if (symbolOrAddress in data) {
                dispatch(changeActive(symbolOrAddress));
              } else {
                message.error("Address is not found!");
              }
            }
          } else {
            const asset = await socket.api.getAssetBySymbol(
              config.TOKEN_REGISTRY,
              symbolOrAddress
            );
            if (asset) {
              let address;
              for (const adr in data) {
                if (
                  ("asset_1" in data[adr] && data[adr].asset_1 === asset) ||
                  ("asset_2" in data[adr] && data[adr].asset_2 === asset) ||
                  ("asset_stable" in data[adr] &&
                    data[adr].asset_stable === asset)
                ) {
                  address = adr;
                }
              }
              if (address) {
                dispatch(changeActive(address));
              }
            } else {
              message.error("Symbol is not found!");
            }
          }
        } else {
          if (recent) {
            dispatch(changeActive(recent));
          } else {
            const keys = Object.keys(data);
            let maxReserve = { address: null, reserve: 0 };
            keys.forEach((address) => {
              if (data[address].reserve >= maxReserve.reserve) {
                maxReserve = { address, reserve: data[address].reserve };
              }
            });
            if (maxReserve.address) {
              dispatch(changeActive(maxReserve.address));
            }
          }
        }
      }
    })();
    // eslint-disable-next-line
  }, [dispatch, loaded]);

  return <div>{children}</div>;
};
