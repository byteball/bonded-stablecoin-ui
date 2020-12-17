import React from "react";
import { Typography, Statistic, Space, Button } from "antd";
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { useWindowSize } from "hooks/useWindowSize";
import { generateLink } from "utils/generateLink";
import { Label } from "components/Label/Label";
import config from "config";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export const Capacitors = ({ stable_state, address, params, reserve_asset_symbol }) => {
  const [width] = useWindowSize();
  const { t } = useTranslation();
  const link = generateLink(1e4, { move_capacity: 1 }, undefined, address);
  const timeToNextMovement =
    stable_state.lost_peg_ts +
    (stable_state.move_capacity_timeout ||
      params.move_capacity_timeout ||
      2 * 3600);

  const isExpiry = moment.utc().unix() > timeToNextMovement;
  const hours = Math.round(params.move_capacity_timeout / 3600);
  const minutes = Math.round(params.move_capacity_timeout - 3600 * hours) / 60;
  
  const currency =
    params.reserve_asset in config.reserves
      ? config.reserves[params.reserve_asset].name
      : reserve_asset_symbol || "";
  return (
    <div>
      <Title level={3}>{t("trade.tabs.capacitor.title", "Capacitors info")}</Title>
      <p>
        <Text type="secondary">
          {t("trade.tabs.capacitor.desc", "Capacitors store fees charged from users who moved the price away from the peg. They are used to reward those who move the price back to the peg.")}
        </Text>
      </p>
      <Space size="large" direction={width > 680 ? "horizontal" : "vertical"}>
        <Statistic
          title={
            <Label
              label={t("trade.tabs.capacitor.fast.title", "Fast capacity")}
              descr={t("trade.tabs.capacitor.fast.desc", "This capacity is immediately available to reward users who move the price back to the peg.")}
            />
          }
          value={Number(stable_state.fast_capacity / 10 ** params.reserve_asset_decimals).toFixed(params.reserve_asset_decimals) || 0}
          suffix={currency}
          precision={params.reserve_asset_decimals}
        />

        <Statistic
          title={
            <Label
              label={t("trade.tabs.capacitor.slow.title", "Slow capacity")}
              descr={t("trade.tabs.capacitor.slow.desc", "This capacity is reserved for the future and will be gradually moved into the fast capacity.")}
            />
          }
          value={Number(stable_state.slow_capacity / 10 ** params.reserve_asset_decimals).toFixed(params.reserve_asset_decimals) || 0}
          suffix={currency}
          precision={params.reserve_asset_decimals}
        />
        <div>
          {isExpiry ? (
            <Statistic
              title={t("trade.tabs.capacitor.time_until.title", "Time until the next movement")}
              value={t("trade.tabs.capacitor.time_until.expired", "Time is expired")}
            />
          ) : (
              <>
                {!isNaN(timeToNextMovement) && (
                  <Countdown
                    title={t("trade.tabs.capacitor.time_until.title", "Time until the next movement")}
                    // format="D [days] HH:mm:ss"
                    value={Math.floor(Date.now() / 1000) + timeToNextMovement}
                  />
                )}
              </>
            )}
        </div>
      </Space>
      <div style={{ marginTop: 20 }}>
        <Title level={3}>{t("trade.tabs.capacitor.move.title", "Move the capacity to fast pool")}</Title>
        <p>
          <Text type="secondary">
            {t("trade.tabs.capacitor.move.desc", "The capacity can be moved from the slow to the fast pool if the price goes off-peg by more than {{threshold_distance}}% and stays there for more than {{hours}} h. {{minutes}} m.", {threshold_distance: params.threshold_distance * 100, hours, minutes})}
          </Text>
        </p>
        <Button type="primary" href={link} disabled={!isExpiry}>
          {t("trade.tabs.capacitor.move.btn", "Click to move")}
        </Button>
      </div>
    </div>
  );
};
