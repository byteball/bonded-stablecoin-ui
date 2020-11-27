import React from "react";
import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";
import { paramsDescription } from "pages/Create/paramsDescription";

export const GovernanceParameters = ({ params }) => {
  const {
    allow_grants,
    allow_oracle_change,
    regular_challenging_period,
    important_challenging_period,
    freeze_period,
    proposal_min_support,
  } = params;

  return (
    <div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.allow_grants}
            label="Allow grants"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{allow_grants ? "allow" : "disallow"}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.allow_oracle_change}
            label="Allow oracle change"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{allow_oracle_change ? "allow" : "disallow"}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.regular_challenging_period}
            label="Regular challenging period"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{regular_challenging_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.important_challenging_period}
            label="Important challenging period"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{important_challenging_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.freeze_period}
            label="Freeze period"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{freeze_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.proposal_min_support}
            label="Proposal min support"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{proposal_min_support}</span>
      </div>
    </div>
  );
};
