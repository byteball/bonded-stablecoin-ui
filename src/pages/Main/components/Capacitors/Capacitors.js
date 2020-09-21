import React from "react";
import { Typography, Statistic, Space, Button } from "antd";
import moment from "moment";

import { useWindowSize } from "hooks/useWindowSize";
import { generateLink } from "utils/generateLink";
import { Label } from "components/Label/Label";
import config from "config";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export const Capacitors = ({ stable_state, address, params }) => {
  const [width] = useWindowSize();
  const link = generateLink(1e4, { move_capacity: 1 }, undefined, address);
  const timeToNextMovement =
    stable_state.lost_peg_ts +
    (stable_state.move_capacity_timeout ||
      params.move_capacity_timeout ||
      2 * 3600);

  const isExpiry = moment().unix() > timeToNextMovement;
  const hours = Math.round(params.move_capacity_timeout / 3600);
  const minutes = Math.round(
    (params.move_capacity_timeout - 3600 * hours) / 60
  );
  const currency =
    params.reserve_asset in config.reserves
      ? config.reserves[params.reserve_asset].name
      : "GBYTE";
  return (
    <div>
      <Title level={3}>Capacitors info</Title>
      <p>
        <Text type="secondary">
          Capacitors store fees charged from users who moved the price away from
          the peg. They are used to reward those who move the price back to the
          peg.
        </Text>
      </p>
      <Space size="large" direction={width > 680 ? "horizontal" : "vertical"}>
        <Statistic
          title={
            <Label
              label="Fast capacity"
              descr="
          This capacity is immediately available to reward users who move the price back to the peg.
          "
            />
          }
          value={Number(stable_state.fast_capacity / 1e9).toFixed(9) || 0}
          suffix={currency}
          precision={9}
        />

        <Statistic
          title={
            <Label
              label="Slow capacity"
              descr="
            This capacity is reserved for the future and will be gradually moved into the fast capacity.
            "
            />
          }
          value={Number(stable_state.slow_capacity / 1e9).toFixed(9) || 0}
          suffix={currency}
          precision={9}
        />
        <div>
          {isExpiry ? (
            <Statistic
              title="Time until the next movement"
              value="Time is expired"
            />
          ) : (
            <>
              {!isNaN(timeToNextMovement) && (
                <Countdown
                  title="Time until the next movement"
                  // format="D [days] HH:mm:ss"
                  value={Math.floor(Date.now() / 1000) + timeToNextMovement}
                />
              )}
            </>
          )}
        </div>
      </Space>
      <div style={{ marginTop: 20 }}>
        <Title level={3}>Move the capacity to fast pool</Title>
        <p>
          <Text type="secondary">
            The capacity can be moved from the slow to the fast pool if the
            price goes off-peg by more than {params.threshold_distance * 100}%
            and stays there for more than {hours !== 0 && hours + " hours and "}{" "}
            {minutes + " minutes"}.
          </Text>
        </p>
        <Button type="primary" href={link} disabled={!isExpiry}>
          Click to move
        </Button>
      </div>
    </div>
  );
};
