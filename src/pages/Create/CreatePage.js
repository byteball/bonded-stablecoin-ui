import React, { useState, useEffect } from "react";
import { Typography, Steps, Switch } from "antd";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";

import { useWindowSize } from "hooks/useWindowSize";
import { CurverStep } from "./components/CurveStep/CurveStep";
import { CapacitorStep } from "./components/CapacitorStep/CapacitorStep";
import { GovernanceStep } from "./components/GovernanceStep/GovernanceStep";
import { CreateStep } from "./components/CreateStep/CreateStep";
import { DecisionStep } from "./components/DecisionStep/DecisionStep";

const { Title, Paragraph } = Typography;
const { Step } = Steps;

export const CreatePage = () => {
  const [current, setCurrent] = useState(0);
  const [type, setType] = useState(2)
  const [data, setData] = useState({});
  const [width] = useWindowSize();
  const { t } = useTranslation();

  useEffect(() => {
    setCurrent(0)
    setData({});
  }, [type])

  return (
    <div>
      <Helmet title="Bonded stablecoins - Create" />
      <Title level={1}>{t("create.title", "Create")}</Title>
      <div style={{ display: "flex" }}>
        <Paragraph style={{ marginRight: 10 }}>Enable "Decision engine" (v2 stablecoins)</Paragraph> <Switch defaultChecked onChange={(c) => setType(c ? 2 : 1)} />
      </div>
      <div><Paragraph type="secondary">{t("create.de_desc", "The decision engine automatically intervenes when it is necessary to return the price back to the peg. A Stability Fund is created to make this possible, all growth tokens are held by the Fund, and investors buy shares in the Fund.")}</Paragraph></div>
      {type && <div>
        <Steps
          size="large"
          current={current}
          type={width >= 992 ? "navigation" : undefined}
          direction={width >= 760 ? "horizontal" : "vertical"}
          style={{ marginBottom: 35 }}
        >
          <Step title={t("create.steps.curve", "Curve")} description={t("create.setting", "Parameter setting")} />
          <Step title={t("create.steps.capacitor", "Capacitor")} description={t("create.setting", "Parameter setting")} />
          <Step title={t("create.steps.governance", "Governance")} description={t("create.setting", "Parameter setting")} />
          {type === 2 && <Step title={t("create.steps.decision", "Decision engine")} description={t("create.setting", "Parameter setting")} />}
          <Step title={t("create.steps.create", "Create")} description={t("create.sending", "Sending a request")} />
        </Steps>

        {current === 0 && (
          <CurverStep type={type} setCurrent={setCurrent} setData={setData} />
        )}
        {current === 1 && (
          <CapacitorStep type={type} setCurrent={setCurrent} setData={setData} />
        )}
        {current === 2 && (
          <GovernanceStep setCurrent={setCurrent} setData={setData} />
        )}

        {current === 3 && type === 2 && <DecisionStep setCurrent={setCurrent} setData={setData} />}
        {((type === 2 && current === 4) || (type === 1 && current === 3)) && <CreateStep setCurrent={setCurrent} data={data} type={type} />}
        {((type === 2 && current !== 4) || (type === 1 && current !== 3)) && (
          <div style={{ fontSize: 16, paddingTop: 18 }}>
            <span style={{ color: "red " }}>*</span> - {t("create.required", "Required field")}
          </div>
        )}
      </div>}
    </div>
  );
};
