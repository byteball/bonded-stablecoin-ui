import React from "react";
import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";
import { ButtonEditParams } from "./ButtonEditParams";
import { paramsDescription } from "pages/Create/paramsDescription";

export const CapacitorParameters = ({ params, address, activeWallet, base_governance }) => {
  const {
    fee_multiplier,
    moved_capacity_share,
    threshold_distance,
    move_capacity_timeout,
    slow_capacity_share,
    sf_capacity_share
  } = params;
  return (
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().fee_multiplier.desc}
            label={paramsDescription().fee_multiplier.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{fee_multiplier} {activeWallet && <ButtonEditParams param="fee_multiplier" address={address} />}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().moved_capacity_share.desc}
            label={paramsDescription().moved_capacity_share.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{moved_capacity_share} {activeWallet && <ButtonEditParams param="moved_capacity_share" address={address}/>}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().threshold_distance.desc}
            label={paramsDescription().threshold_distance.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{threshold_distance} {activeWallet && <ButtonEditParams param="threshold_distance" address={address} />}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().move_capacity_timeout.desc}
            label={paramsDescription().move_capacity_timeout.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{move_capacity_timeout} {activeWallet && <ButtonEditParams param="move_capacity_timeout" address={address} />}</span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().slow_capacity_share.desc}
            label={paramsDescription().slow_capacity_share.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{slow_capacity_share} {activeWallet && <ButtonEditParams param="slow_capacity_share" address={address}/>}</span>
      </div>
      {base_governance === "LXHUYEV6IHBCTGMFNSWRBBU7DGR3JTIY" && <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().sf_capacity_share.desc}
            label={paramsDescription().sf_capacity_share.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{sf_capacity_share} {activeWallet && <ButtonEditParams param="sf_capacity_share" address={address} />}</span>
      </div>}
    </div>
  );
};
