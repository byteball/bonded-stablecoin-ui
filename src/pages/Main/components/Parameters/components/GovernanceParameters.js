import React from "react";
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().allow_grants.desc}
            label={paramsDescription().allow_grants.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{allow_grants ? t("create.allow", "allow") : t("create.disallow","disallow")}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().allow_oracle_change.desc}
            label={paramsDescription().allow_oracle_change.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{allow_oracle_change ? t("create.allow", "allow") : t("create.disallow","disallow")}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().regular_challenging_period.desc}
            label={paramsDescription().regular_challenging_period.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{regular_challenging_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().important_challenging_period.desc}
            label={paramsDescription().important_challenging_period.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{important_challenging_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().freeze_period.desc}
            label={paramsDescription().freeze_period.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{freeze_period}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription().proposal_min_support.desc}
            label={paramsDescription().proposal_min_support.name}
          />
          <span className={styles.semi}>:</span>
        </div>
        <span>{proposal_min_support}</span>
      </div>
    </div>
  );
};
