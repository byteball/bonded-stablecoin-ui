import React from "react";
import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";
import { ButtonEditParams } from "./ButtonEditParams";

export const CapacitorParameters = ({ params, address, activeWallet }) => {
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
            descr="Multiplier used to calculate fees charged for moving the price away from the peg. The larger the multiplier, the larger the fees paid by users for moving the price off-peg."
            label="Fee multiplier"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{fee_multiplier} {activeWallet && <ButtonEditParams param="fee_multiplier" address={address} />}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Part of the slow capacitor that is moved into the fast capacitor after a timeout."
            label="Moved capacity share"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{moved_capacity_share} {activeWallet && <ButtonEditParams param="moved_capacity_share" address={address}/>}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Threshold distance from the target price that triggers the countdown before moving funds from the slow to the fast capacitor."
            label="Threshold distance"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{threshold_distance} {activeWallet && <ButtonEditParams param="threshold_distance" address={address} />}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="How long we wait (in seconds) before moving part of the slow capacity into the fast one."
            label="Move capacity timeout"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{move_capacity_timeout} {activeWallet && <ButtonEditParams param="move_capacity_timeout" address={address} />}</span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Share of fees that goes into the slow capacitor. The rest goes into the fast one."
            label="Slow capacity share"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{slow_capacity_share} {activeWallet && <ButtonEditParams param="slow_capacity_share" address={address}/>}</span>
      </div>
    </div>
  );
};
