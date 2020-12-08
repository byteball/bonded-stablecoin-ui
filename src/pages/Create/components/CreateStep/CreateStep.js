import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { WalletOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import ReactGA from "react-ga";
import { useTranslation } from 'react-i18next';

import { generateLink } from "utils/generateLink";
import { pendingIssue } from "store/actions/pendings/pendingIssue";
import { resetIssueStablecoin } from "store/actions/pendings/resetIssueStablecoin";
import { changeActive } from "store/actions/active/changeActive";

import config from "config";

export const CreateStep = ({ data, setCurrent }) => {
  const pendings = useSelector((state) => state.pendings.stablecoin);
  const { sendReq, addressIssued } = pendings;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const link = generateLink(1.5e4, data, undefined, config.FACTORY_AAS[config.FACTORY_AAS.length - 1]);

  useEffect(() => {
    dispatch(pendingIssue(data));
  }, [dispatch, data]);

  if (addressIssued) {
    dispatch(changeActive(addressIssued));
    dispatch(resetIssueStablecoin());
  }

  if (sendReq) {
    return (
      <Result
        icon={<LoadingOutlined />}
        title={t("create.received.title", "Request received")}
        subTitle={t("create.received.subTitle", "Once the transaction is stable, you'll be redirected to the page of the new stablecoin")}
        extra={[
          <Button
            onClick={() => {
              setCurrent(0);
              dispatch(resetIssueStablecoin());
            }}
            type="danger"
            key="CreateStep-reset-req"
          >
            {t("create.received.close", "Close")}
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      status="info"
      icon={<WalletOutlined />}
      title= {t("create.sending_request.title", "Almost ready!")}
      subTitle={t("create.sending_request.subTitle", "Please click the «Create» button below, this will open your Obyte wallet and you'll send a transaction that will create the new stablecoin.")}
      extra={[
        <Button
          href={link}
          type="primary"
          key="CreateStep-create"
          onClick={() => {
            ReactGA.event({
              category: "Stablecoin",
              action: "Create stablecoin",
            });
          }}
        >
          {t("create.sending_request.create", "Create")}
        </Button>,
        <Button
          onClick={() => {
            setCurrent(0);
          }}
          type="danger"
          key="CreateStep-reset"
        >
          {t("create.sending_request.reset", "Reset")}
        </Button>,
      ]}
    />
  );
};
