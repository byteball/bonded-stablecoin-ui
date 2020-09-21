import React, { useState, useEffect } from "react";
import { Typography, Steps } from "antd";

import { useWindowSize } from "hooks/useWindowSize";
import { CurverStep } from "./components/CurveStep/CurveStep";
import { CapacitorStep } from "./components/CapacitorStep/CapacitorStep";
import { GovernanceStep } from "./components/GovernanceStep/GovernanceStep";
import { CreateStep } from "./components/CreateStep/CreateStep";

const { Title } = Typography;
const { Step } = Steps;

export const CreatePage = () => {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({});
  const [width] = useWindowSize();
  useEffect(() => {
    document.title = "Bonded stablecoins - Create";
  }, []);
  return (
    <div>
      <Title level={1}>Create</Title>
      <Steps
        size="large"
        current={current}
        type={width >= 992 ? "navigation" : undefined}
        direction={width >= 760 ? "horizontal" : "vertical"}
        style={{ marginBottom: 35 }}
      >
        <Step title="Curve" description="Parameter setting" />
        <Step title="Capacitor" description="Parameter setting" />
        <Step title="Governance" description="Parameter setting" />
        <Step title="Create" description="Sending a request" />
      </Steps>

      {current === 0 && (
        <CurverStep setCurrent={setCurrent} setData={setData} />
      )}
      {current === 1 && (
        <CapacitorStep setCurrent={setCurrent} setData={setData} />
      )}
      {current === 2 && (
        <GovernanceStep setCurrent={setCurrent} setData={setData} />
      )}
      {current === 3 && <CreateStep setCurrent={setCurrent} data={data} />}
      {current !== 3 && (
        <div style={{ fontSize: 16, paddingTop: 18 }}>
          <span style={{ color: "red " }}>*</span> - This field is required
        </div>
      )}
    </div>
  );
};
