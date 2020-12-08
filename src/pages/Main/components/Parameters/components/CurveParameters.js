import React, {useState} from "react";
import { Button } from "antd";
import { useTranslation } from 'react-i18next';

import { Label } from "components/Label/Label";
import { OracleInfoModal } from "modals/OracleInfoModal/OracleInfoModal";
import { ButtonEditParams } from "./ButtonEditParams";
import { paramsDescription } from "pages/Create/paramsDescription";

import styles from "../Parameters.module.css";
import config from "config";

export const CurveParameters = ({
  params,
  oracleValue1,
  oracleValue2,
  oracleValue3,
  reserve_asset_symbol,
  address,
  activeWallet
}) => {
  const [activeOracle, setActiveOracle] = useState(undefined);
  const { t } = useTranslation();
  const {
    oracle1,
    oracle2,
    oracle3,
    feed_name1,
    feed_name2,
    feed_name3,
    op1,
    op2,
    op3,
    oracles,
    reserve_asset,
    reserve_asset_decimals,
    decimals1,
    decimals2,
    leverage,
    m,
    n,
    interest_rate,
  } = params;

  return (
    <div style={{ marginBottom: 20 }}>
      {((oracles && oracles[0]) || (!oracles && oracle1)) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().oracle1.desc}
                label={paramsDescription().oracle1.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>
              {oracles ? oracles[0].oracle : oracle1}
              <Button type="link" size="small" onClick={()=>setActiveOracle(oracles ? oracles[0].oracle : oracle1)}>({t("trade.tabs.parameters.show_info", "Show info")})</Button>
            </span>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label descr={paramsDescription().feed_name1.desc} label={paramsDescription().feed_name1.name} />
            </div>
            <span className={styles.semi}>:</span>
            <span>
              {oracles ? oracles[0].feed_name : feed_name1} ({t("trade.tabs.parameters.latest_value", "Latest value")}:{" "}
              {oracleValue1})
            </span>
          </div>

          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().op1.desc}
                label={paramsDescription().op1.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[0].op || "*" : op1 || "*"}</span>
          </div>
        </>
      )}
      
      {((oracles && oracles[1]) || (!oracles && oracle2)) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().oracle2.desc}
                label={paramsDescription().oracle2.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[1].oracle : oracle2}</span>
            <Button type="link" size="small" onClick={()=>setActiveOracle(oracles ? oracles[1].oracle : oracle2)}>({t("trade.tabs.parameters.show_info", "Show info")})</Button>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().feed_name2.desc}
                label={paramsDescription().feed_name2.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>
              {oracles ? oracles[1].feed_name : feed_name2} ({t("trade.tabs.parameters.latest_value", "Latest value")}:{" "}
              {oracleValue2})
            </span>
          </div>

          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().op2.desc}
                label={paramsDescription().op2.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[1].op || "*" : op2 || "*"}</span>
          </div>
        </>
      )}

      {((oracles && oracles[2]) || (!oracles && oracle3)) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().oracle3.desc}
                label={paramsDescription().oracle3.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[2].oracle : oracle3}</span>
            <Button type="link" size="small" onClick={()=>setActiveOracle(oracles ? oracles[2].oracle : oracle3)}>({t("trade.tabs.parameters.show_info", "Show info")})</Button>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().feed_name3.desc}
                label={paramsDescription().feed_name3.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>
              {oracles ? oracles[2].feed_name : feed_name3} ({t("trade.tabs.parameters.latest_value", "Latest value")}:{" "}
              {oracleValue3})
            </span>
          </div>

          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription().op3.desc}
                label={paramsDescription().op3.name}
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[2].op || "*" : op3 || "*"}</span>
          </div>
        </>
      )}

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().reserve_asset.desc}
            label={paramsDescription().reserve_asset.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{reserve_asset === "base"
          ? "GBYTE"
          : config.reserves[reserve_asset]
            ? config.reserves[reserve_asset].name
            : reserve_asset_symbol || ''}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().reserve_decimals.desc}
            label={paramsDescription().reserve_decimals.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{reserve_asset_decimals}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label descr={paramsDescription().decimals1.desc} label={paramsDescription().decimals1.name} />

          <span className={styles.semi}>:</span>
        </div>
        <span>{decimals1}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().decimals2.desc}
            label={paramsDescription().decimals2.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{decimals2}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().leverage.desc}
            label={paramsDescription().leverage.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{leverage}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().m.desc}
            label={paramsDescription().m.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{m}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().n.desc}
            label={paramsDescription().n.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{n}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().interest_rate.desc}
            label={paramsDescription().interest_rate.name}
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{interest_rate * 100} % {activeWallet && <ButtonEditParams param="interest_rate" address={address} />}</span>
      </div>
      <OracleInfoModal address={activeOracle} onCancel={()=>setActiveOracle(undefined)}/>
    </div>
  );
};
