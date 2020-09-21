import React from "react";
import { Statistic, Button } from "antd";
import moment from "moment";

import { generateLink } from "utils/generateLink";

const { Countdown } = Statistic;

export const InfoOracle = ({
  oracles,
  important_challenging_period,
  activeWallet,
  governance_aa,
}) => {
  const now = moment().unix();
  const challengingPriod =
    oracles &&
    "challenging_period_start_ts" in oracles &&
    oracles.challenging_period_start_ts + important_challenging_period;

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {challengingPriod !== undefined && now < challengingPriod && (
          <Countdown
            value={moment.unix(challengingPriod)}
            title="Сhallenging period"
          />
        )}
        {!challengingPriod && (
          <Statistic
            value="Not started"
            title="Сhallenging period"
            valueStyle={{ fontSize: 16 }}
          />
        )}
        {challengingPriod && now > challengingPriod && (
          <>
            <Statistic
              value="Expired"
              title="Сhallenging period"
              valueStyle={{ fontSize: 16 }}
            />
            <Button
              size="small"
              type="primary"
              disabled={
                !("leader" in oracles) || oracles.leader === oracles.value
              }
              href={generateLink(
                1e4,
                { name: "oracles", commit: 1 },
                activeWallet,
                governance_aa
              )}
              style={{ marginTop: 10 }}
            >
              Commit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
