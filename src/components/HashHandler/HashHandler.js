/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import obyte from "obyte";
import { message, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import socket from "services/socket";

import history from "../../historyInstance";
import { changeActive } from "store/actions/active/changeActive";
import config from "config";
import { langs } from "components/SelectLanguage/SelectLanguage";
import { changeActiveForBot } from "store/actions/active/changeActiveForBot";
import { botCheck } from "utils/botCheck";

export const HashHandler = ({ children }) => {
  const { loaded, data } = useSelector((state) => state.list);
  const { address } = useSelector((state) => state.active);
  const { recent } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const splitUrl = history.location.pathname.split("/").slice(1);
  const startIndex = langs.find((lang) => lang.name === splitUrl[0]) ? 1 : 0;
  useEffect(() => {
    (async () => {
      if (loaded) {
        if (
          splitUrl[startIndex] === "trade" &&
          splitUrl[startIndex + 1] !== "" &&
          splitUrl[startIndex + 1] !== undefined
        ) {
          const symbolOrAddress = splitUrl[startIndex + 1];
          if (obyte.utils.isValidAddress(symbolOrAddress)) {
            if (address !== symbolOrAddress) {
              if (symbolOrAddress in data) {
                if (botCheck(navigator.userAgent)) {
                  dispatch(changeActiveForBot(symbolOrAddress));
                } else {
                  dispatch(changeActive(symbolOrAddress));
                }
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
                if (botCheck(navigator.userAgent)) {
                  dispatch(changeActiveForBot(address));
                } else {
                  dispatch(changeActive(address));
                }
              }
            } else {
              message.error("Symbol is not found!");
            }
          }
        } else {
          if (recent) {
            if (botCheck(navigator.userAgent)) {
              dispatch(changeActiveForBot(recent));
            } else {
              dispatch(changeActive(recent));
            }
          } else {
            const keys = Object.keys(data);
            let maxReserve = { address: null, reserve: 0 };
            keys.forEach((address) => {
              if (data[address].reserve >= maxReserve.reserve) {
                maxReserve = { address, reserve: data[address].reserve };
              }
            });
            if (maxReserve.address) {
              if (botCheck(navigator.userAgent)) {
                dispatch(changeActiveForBot(maxReserve.address));
              } else {
                dispatch(changeActive(maxReserve.address));
              }
            }
          }
        }
      }
    })();
    // eslint-disable-next-line
  }, [dispatch, loaded]);

  return address ? <div>{children}</div> : <div style={{ display: "flex", justifyContent: "center" }}>
    <Spin size="large" />
  </div>;
};
