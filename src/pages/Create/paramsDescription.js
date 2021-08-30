import React from "react";
import { Trans } from "react-i18next";
import i18n from "../../locale/index";

export const paramsDescription = () => ({
  leverage: {
    name: i18n.t("params.leverage.name", "Leverage"),
    desc: i18n.t("params.leverage.desc", "Leverage applied to Token2. Use 0 (the default) to track the oracle price. Use positive values to create an asset that represents leveraged long positions in the reserve asset, negative values for leveraged short positions.")
  },
  decimals1: {
    name: i18n.t("params.decimals1.name", "Decimals 1"),
    desc: i18n.t("params.decimals1.desc", "Decimals of Token1 (growth token)")
  },
  decimals2: {
    name: i18n.t("params.decimals2.name", "Decimals 2"),
    desc: i18n.t("params.decimals2.desc", "Decimals of Token2 (interest token, or stable token if interest is 0)")
  },
  reserve_decimals: {
    name: i18n.t("params.reserve_decimals.name", "Reserve decimals"),
    desc: i18n.t("params.reserve_decimals.desc", "Decimals of the reserve asset units."),
  },
  m: {
    name: "m",
    desc: <Trans i18nKey="params.m.desc">
      Power m in the bonding curve r=s<sub>1</sub>
      <sup>m</sup> s<sub>2</sub>
      <sup>n</sup>
    </Trans>
  },
  n: {
    name: "n",
    desc: <Trans i18nKey="params.n.desc">
      Power n in the bonding curve r=s<sub>1</sub>
      <sup>m</sup> s<sub>2</sub>
      <sup>n</sup>
    </Trans>
  },
  reserve_asset: {
    name: i18n.t("params.reserve_asset.name", "Reserve asset"),
    desc: i18n.t("params.reserve_asset.desc", "Asset used as reserve to back the issuance of Token1 and Token2. GBYTE is the default."),
  },
  interest_rate: {
    name: i18n.t("params.interest_rate.name", "Interest rate"),
    desc: i18n.t("params.interest_rate.desc", "Interest rate that Token2 earns on top of the stable token. Type 0.1 for 10%."),
  },
  moved_capacity_share: {
    name: i18n.t("params.moved_capacity_share.name", "Moved capacity share"),
    desc: i18n.t("params.moved_capacity_share.desc", "Part of the slow capacitor that is moved into the fast capacitor after a timeout.")
  },
  fee_multiplier: {
    name: i18n.t("params.fee_multiplier.name", "Fee multiplier"),
    desc: i18n.t("params.fee_multiplier.desc", "Multiplier used to calculate fees charged for moving the price away from the peg. The larger the multiplier, the larger the fees paid by users for moving the price off-peg.")
  },
  move_capacity_timeout: {
    name: i18n.t("params.move_capacity_timeout.name", "Move capacity timeout"),
    desc: i18n.t("params.move_capacity_timeout.desc", "How long we wait (in seconds) before moving part of the slow capacity into the fast one.",)
  },
  threshold_distance: {
    name: i18n.t("params.threshold_distance.name", "Threshold distance"),
    desc: i18n.t("params.threshold_distance.desc", "Threshold distance from the target price that triggers the countdown before moving funds from the slow to the fast capacitor.")
  },
  slow_capacity_share: {
    name: i18n.t("params.slow_capacity_share.name", "Slow capacity share"),
    desc: i18n.t("params.slow_capacity_share.desc", "Share of fees that goes into the slow capacitor. The rest goes into the fast one."),
  },
  min_deposit_term: {
    name: i18n.t("params.min_deposit_term.name", "Min deposit term"),
    desc: i18n.t("params.min_deposit_term.desc", "Minimum deposit term in seconds. During this period, the deposit cannot be closed.")
  },
  challenging_period: {
    name: i18n.t("params.challenging_period.name", "Challenging period"),
    desc: i18n.t("params.challenging_period.desc", "The period in seconds when a deposit close attempt can be challenged. The deposit with the least protection can be closed by anybody, not just the owner. An attempt to close it starts a challenging period during which the close can be challenged by indicating another deposit with even less protection. In this case, the reporter earns part of the deposit amount while the closer loses.")
  },
  challenge_immunity_period: {
    name: i18n.t("params.challenge_immunity_period.name", "Challenge immunity period"),
    desc: i18n.t("params.challenge_immunity_period.desc", "The additional period in seconds during which a deposit cannot be used for challenging the closes of other deposits. This period applies after the minimum deposit term and after the last protection withdrawal of the less protected deposit.")
  },
  reporter_share: {
    name: i18n.t("params.reporter_share.name", "Reporter share"),
    desc: i18n.t("params.reporter_share.desc", "The share of the deposit amount paid to users who report invalid close attempts when a deposit to be closed is not the least protected.")
  },
  oracles: {
    name: i18n.t("params.oracles.name", "Oracles"),
    desc: i18n.t("params.oracles.desc", "The oracles that report the price for the stable token")
  },
  oracle1: {
    name: i18n.t("params.oracle1.name", "Oracle 1"),
    desc: i18n.t("params.oracle1.desc", "Address of the oracle that reports the price for the stable token")
  },
  feed_name1: {
    name: i18n.t("params.feed_name1.name", "Feed name 1"),
    desc: i18n.t("params.feed_name1.desc", "Name of the oracle’s data feed")
  },
  op1: {
    name: i18n.t("params.op1.name", "Operation 1"),
    desc: i18n.t("params.op1.desc", "How the oracle’s price is interpreted: use ‘*’ if the oracle reports the price of the reserve currency in terms of the stable currency (this is the default). Use ‘/’ if it is the reverse, i.e. the price of the stable token in terms of the reserve asset.")
  },
  oracle2: {
    name: i18n.t("params.oracle2.name", "Oracle 2"),
    desc: i18n.t("params.oracle2.desc", "Optional second oracle. Use it if you want to multiply or divide prices of different assets. E.g. to create a stablecoin pegged to TSLA, you need to divide two price feeds: GBYTE/USD and TSLA/USD.")
  },
  feed_name2: {
    name: i18n.t("params.feed_name2.name", "Feed name 2"),
    desc: i18n.t("params.feed_name2.desc", "Name of the 2nd oracle’s data feed.")
  },
  op2: {
    name: i18n.t("params.op2.name", "Operation 2"),
    desc: i18n.t("params.op2.desc", "What to do with the 2nd price: multiply or divide.")
  },
  oracle3: {
    name: i18n.t("params.oracle3.name", "Oracle 3"),
    desc: i18n.t("params.oracle3.desc", "Optional 3rd oracle, like the 2nd one.")
  },
  feed_name3: {
    name: i18n.t("params.feed_name3.name", "Feed name 3"),
    desc: i18n.t("params.feed_name3.desc", "Name of the 3rd oracle’s data feed.")
  },
  op3: {
    name: i18n.t("params.op3.name", "Operation 3"),
    desc: i18n.t("params.op3.desc", "What to do with the 3rd price: multiply or divide.")
  },
  allow_grants: {
    name: i18n.t("params.allow_grants.name", "Allow grants"),
    desc: i18n.t("params.allow_grants.desc", "Whether to allow paying grants to teams that promise to promote the use of the stablecoin. Grants are voted on by Token1 holders, and if approved, they dilute Token1 holders.")
  },
  allow_oracle_change: {
    name: i18n.t("params.allow_oracle_change.name", "Allow oracle change"),
    desc: i18n.t("params.allow_oracle_change.desc", "Whether to allow updating the oracles by Token1 holders vote after the stablecoin AA is created.")
  },
  regular_challenging_period: {
    name: i18n.t("params.regular_challenging_period.name", "Regular challenging period"),
    desc: i18n.t("params.regular_challenging_period.desc", "Challenging period (in seconds) for votes by Token1 holders on regular issues.")
  },
  important_challenging_period: {
    name: i18n.t("params.important_challenging_period.name", "Important challenging period"),
    desc: i18n.t("params.important_challenging_period.desc", "Challenging period (in seconds) for votes by Token1 holders on important issues such as changing an oracle.")
  },
  freeze_period: {
    name: i18n.t("params.freeze_period.name", "Freeze period"),
    desc: i18n.t("params.freeze_period.desc", "How long (in seconds) the voting tokens of the supporters of the winning option are frozen after the decision is made.")
  },
  proposal_min_support: {
    name: i18n.t("params.proposal_min_support.name", "Proposal min support"),
    desc: i18n.t("params.proposal_min_support.desc", "What share of the total Token1 supply should vote for a grant proposal for the proposal to be eligible to win.")
  },
  below_peg_threshold: {
    name: i18n.t("params.below_peg_threshold.name", "Below peg threshold"),
    desc: i18n.t("params.below_peg_threshold.desc", "Threshold deviation of the price below the peg that starts a countdown before the DE intervention"),
  },
  below_peg_timeout: {
    name: i18n.t("params.below_peg_timeout.name", "Below peg timeout"),
    desc: i18n.t("params.below_peg_timeout.desc", "How long the price has to stay below the peg for the DE to interfere"),
  },
  min_reserve_delta: {
    name: i18n.t("params.min_reserve_delta.name", "Min reserve delta"),
    desc: i18n.t("params.min_reserve_delta.desc", "Minimum amount of a DE-initiated transaction"),
  },
  decision_engine_aa: {
    name: i18n.t("params.decision_engine_aa.name", "Decision engine AA"),
    desc: i18n.t("params.decision_engine_aa.desc", "Autonomous Agent of Decision Engine. It manages the Stability Fund to keep the price stable."),
  },
  sf_capacity_share: {
    name: i18n.t("params.sf_capacity_share.name", "Stability fund capacity share"),
    desc: i18n.t("params.sf_capacity_share.desc", "What part of slow capacity is moved to stability fund"),
  }
});
