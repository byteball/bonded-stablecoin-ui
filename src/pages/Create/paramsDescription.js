import React from "react";

export const paramsDescription = {
  leverage: "Leverage applied to Token2. Use 0 (the default) to track the oracle price. Use positive values to create an asset that represents leveraged long positions in the reserve asset, negative values for leveraged short positions.",
  decimals1: "Decimals of Token1 (growth token)",
  decimals2: "Decimals of Token2 (interest token, or stable token if interest is 0)",
  reserve_decimals: "Decimals of the reserve asset units.",
  m: <span>
    Power m in the bonding curve r=s<sub>1</sub>
    <sup>m</sup> s<sub>2</sub>
    <sup>n</sup>
  </span>,
  n: <span>
    Power n in the bonding curve r=s<sub>1</sub>
    <sup>m</sup> s<sub>2</sub>
    <sup>n</sup>
  </span>,
  reserve_asset: "Asset used as reserve to back the issuance of Token1 and Token2. GBYTE is the default.",
  interest_rate:
    "Interest rate that Token2 earns on top of the stable token. Type 0.1 for 10%.",
  moved_capacity_share:
    "Part of the slow capacitor that is moved into the fast capacitor after a timeout.",
  fee_multiplier:
    "Multiplier used to calculate fees charged for moving the price away from the peg. The larger the multiplier, the larger the fees paid by users for moving the price off-peg.",
  move_capacity_timeout:
    "How long we wait (in seconds) before moving part of the slow capacity into the fast one.",
  threshold_distance:
    "Threshold distance from the target price that triggers the countdown before moving funds from the slow to the fast capacitor.",
  slow_capacity_share:
    "Share of fees that goes into the slow capacitor. The rest goes into the fast one.",
  min_deposit_term:
    "Minimum deposit term in seconds. During this period, the deposit cannot be closed.",
  challenging_period:
    "The period in seconds when a deposit close attempt can be challenged. The deposit with the least protection can be closed by anybody, not just the owner. An attempt to close it starts a challenging period during which the close can be challenged by indicating another deposit with even less protection. In this case, the reporter earns part of the deposit amount while the closer loses.",
  challenge_immunity_period:
    "The additional period in seconds during which a deposit cannot be used for challenging the closes of other deposits. This period applies after the minimum deposit term and after the last protection withdrawal of the less protected deposit.",
  reporter_share:
    "The share of the deposit amount paid to users who report invalid close attempts when a deposit to be closed is not the least protected.",
  oracles: "The oracles that report the price for the stable token",
  oracle1: "Address of the oracle that reports the price for the stable token",
  feed_name1: "Name of the oracle’s data feed",
  op1: "How the oracle’s price is interpreted: use ‘*’ if the oracle reports the price of the reserve currency in terms of the stable currency (this is the default). Use ‘/’ if it is the reverse, i.e. the price of the stable token in terms of the reserve asset.",
  oracle2: "Optional second oracle. Use it if you want to multiply or delete prices of different assets. E.g. to create a stablecoin pegged to TSLA, you need to divide two price feeds: GBYTE/USD and TSLA/USD.",
  feed_name2: "Name of the 2nd oracle’s data feed.",
  op2: "What to do with the 2nd price: multiply or delete.",
  oracle3: "Optional 3rd oracle, like the 2nd one.",
  feed_name3: "Name of the 3rd oracle’s data feed.",
  op3: "What to do with the 3rd price: multiply or delete.",
  allow_grants: "Whether to allow paying grants to teams that promise to promote the use of the stablecoin. Grants are voted on by Token1 holders, and if approved, they dilute Token1 holders.",
  allow_oracle_change: "Whether to allow updating the oracles by Token1 holders vote after the stablecoin AA is created.",
  regular_challenging_period: "Challenging period (in seconds) for votes by Token1 holders on regular issues.",
  important_challenging_period: "Challenging period (in seconds) for votes by Token1 holders on important issues such as changing an oracle.",
  freeze_period: "How long (in seconds) the voting tokens of the supporters of the winning option are frozen after the decision is made.",
  proposal_min_support: "What share of the total Token1 supply should vote for a grant proposal for the proposal to be eligible to win.",

};
