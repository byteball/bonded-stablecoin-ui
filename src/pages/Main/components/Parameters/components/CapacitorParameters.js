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
  } = params;
  return (
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.fee_multiplier}
            label="Fee multiplier"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{fee_multiplier} {activeWallet && !(base_governance === "Y4VBXMROK5BWBKSYYAMUW7QUEZFXYBCF" && fee_multiplier < 1) && <ButtonEditParams param="fee_multiplier" address={address} />}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.moved_capacity_share}
            label="Moved capacity share"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{moved_capacity_share} {activeWallet && <ButtonEditParams param="moved_capacity_share" address={address}/>}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.threshold_distance}
            label="Threshold distance"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{threshold_distance} {activeWallet && <ButtonEditParams param="threshold_distance" address={address} />}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.move_capacity_timeout}
            label="Move capacity timeout"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{move_capacity_timeout} {activeWallet && <ButtonEditParams param="move_capacity_timeout" address={address} />}</span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.slow_capacity_share}
            label="Slow capacity share"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{slow_capacity_share} {activeWallet && <ButtonEditParams param="slow_capacity_share" address={address}/>}</span>
      </div>
    </div>
  );
};
