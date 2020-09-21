import React from "react";
import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";

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
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Whether to allow paying grants to teams that promise to promote the use of the stablecoin. Grants are voted on by Token1 holders, and if approved, they dilute Token1 holders."
            label="Allow grants"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{allow_grants ? "allow" : "disallow"}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Whether to allow updating the oracles by Token1 holders vote after the stablecoin AA is created."
            label="Allow oracle change"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{allow_oracle_change ? "allow" : "disallow"}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Challenging period (in seconds) for votes by Token1 holders on regular issues."
            label="Regular challenging period"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{regular_challenging_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Challenging period (in seconds) for votes by Token1 holders on important issues such as changing an oracle."
            label="Important challenging period"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{important_challenging_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="How long (in seconds) the voting tokens of the supporters of the winning option are frozen after the decision is made."
            label="Freeze period"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{freeze_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="What share of the total Token1 supply should vote for a grant proposal for the proposal to be eligible to win."
            label="Proposal min support"
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{proposal_min_support}</span>
      </div>
    </div>
  );
};
