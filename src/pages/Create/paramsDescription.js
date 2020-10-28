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
};
