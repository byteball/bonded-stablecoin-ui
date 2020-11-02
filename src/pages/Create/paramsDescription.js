export const paramsDescription = {
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
    "The share of the deposit amount paid to users who report invalid close attempts when a deposit to be closed is not the least protected."
};
