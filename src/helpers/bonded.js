import { Decimal as DecimalDefault } from "decimal.js";

const Decimal = DecimalDefault.clone({ precision: 15 });

export const $get_turnover = (
  reserve_payout,
  tokens1,
  tokens2,
  p2,
  reserve_asset_decimals,
  decimals2
) => {
  const reserve_turnover = Math.abs(reserve_payout);
  if ((tokens1 >= 0 && tokens2 >= 0) || (tokens1 <= 0 && tokens2 <= 0)) {
    return reserve_turnover;
  }

  const token2_turnover =
    Math.abs(tokens2) * p2 * 10 ** (reserve_asset_decimals - decimals2);
  if (
    (tokens2 >= 0 && reserve_payout >= 0) ||
    (tokens2 <= 0 && reserve_payout <= 0)
  ) {
    return token2_turnover + reserve_turnover;
  }
};
export const $get_p2 = (s1, s2, dilution_factor, m, n) => {
  return (
    dilution_factor *
    s1 ** m *
    n *
    (Number.isInteger(n * 2) ? Math.sqrt(s2 ** ((n - 1) * 2)) : s2 ** (n - 1))
  );
};

export const $get_fee = (
  avg_reserve,
  old_distance,
  new_distance,
  fee_multiplier
) =>
  fee_multiplier *
  avg_reserve *
  (new_distance - old_distance) *
  (new_distance + old_distance);

export const $get_reserve = (s1, s2, m, n, dilution_factor) => {
  return dilution_factor * s1 ** m * s2 ** n;
};

export const $get_growth_factor = (
  interest_rate,
  timestamp,
  rate_update_ts,
  growth_factor
) => {
  const term = (timestamp - rate_update_ts) / (360 * 24 * 3600);
  const result = growth_factor * (1 + interest_rate) ** term;

  return result;
};

export const $get_target_p2 = (
  oracle_price,
  leverage,
  interest_rate,
  timestamp,
  rate_update_ts,
  growth_factor
) => {
  return Decimal.pow(oracle_price, leverage - 1)
    .mul(
      $get_growth_factor(
        interest_rate,
        timestamp,
        rate_update_ts,
        growth_factor
      )
    )
    .toNumber();
};

export const $get_exchange_result = ({
  tokens1,
  tokens2,
  vars,
  params,
  oracle_price,
  timestamp,
  reservePrice,
}) => {
  let {
    growth_factor,
    reserve = 0,
    supply1 = 0,
    supply2 = 0,
    fast_capacity = 0,
    dilution_factor,
    rate_update_ts,
  } = vars;

  const {
    slow_capacity_share,
    leverage,
    decimals1,
    decimals2,
    reserve_asset_decimals,
    m,
    n,
    fee_multiplier,
    interest_rate,
  } = params;
  const fast_capacity_share = 1 - slow_capacity_share;
  const initial_p2 = vars.p2;
  const target_p2 = $get_target_p2(
    oracle_price,
    leverage,
    interest_rate,
    timestamp,
    rate_update_ts,
    growth_factor
  );
  const distance =
    initial_p2 !== undefined ? Math.abs(initial_p2 - target_p2) / target_p2 : 0;
  const new_supply1 = supply1 + tokens1;
  const new_supply2 = supply2 + tokens2;

  const s1 = new_supply1 / 10 ** decimals1;
  const s2 = new_supply2 / 10 ** decimals2;

  const r = $get_reserve(s1, s2, m, n, dilution_factor);
  const p2 = $get_p2(s1, s2, dilution_factor, m, n);
  const new_reserve = Math.ceil(r * 10 ** reserve_asset_decimals);
  const reserve_delta = new_reserve - reserve;
  const new_distance = Math.abs(p2 - target_p2) / target_p2;
  const avg_reserve = (reserve + new_reserve) / 2;

  let fee,
    reward,
    reserve_needed,
    regular_fee,
    new_fast_capacity,
    distance_share,
    reverse_reward;

  if (distance === 0 && new_distance === 0) {
    fee = 0;
    reward = 0;
    reserve_needed = reserve_delta;
  } else if (new_distance >= distance) {
    // going away from the target price - pay a fee
    reward = 0;
    regular_fee = $get_fee(avg_reserve, distance, new_distance, fee_multiplier);
    new_fast_capacity = fast_capacity + regular_fee * fast_capacity_share;
    distance_share = 1 - distance / new_distance;
    // reward that would be paid for returning the price back to $initial_p2
    reverse_reward = distance_share * new_fast_capacity;
    if (regular_fee >= reverse_reward) {
      fee = regular_fee;
    } else {
      fee = Decimal.ceil(
        new Decimal(distance_share)
          .div(1 - distance_share * fast_capacity_share)
          .mul(fast_capacity)
      ).toNumber();
    }

    reserve_needed = reserve_delta + fee; // negative for payouts
  } else {
    // going towards the target price - get a reward
    fee = 0;
    reward = Math.floor((1 - new_distance / distance) * fast_capacity);
    reserve_needed = reserve_delta - reward; // negative for payouts
  }

  const turnover = $get_turnover(-reserve_delta, tokens1, tokens2, p2);
  const fee_percent = (fee / turnover) * 100;
  const reward_percent = (reward / turnover) * 100;
  const network_fee = 1e3;
  const full_network_fee = network_fee;

  const reserve_asset_amount = 1e4 - full_network_fee;

  const payout = reserve_asset_amount - reserve_needed;

  const s1init = initial_p2
    ? (initial_p2 /
        (dilution_factor *
          n *
          (Number.isInteger(n * 2)
            ? Math.sqrt(s2 ** ((n - 1) * 2))
            : s2 ** (n - 1)))) **
      (1 / m)
    : (target_p2 /
        (dilution_factor *
          n *
          (Number.isInteger(n * 2)
            ? Math.sqrt(s2 ** ((n - 1) * 2))
            : s2 ** (n - 1)))) **
      (1 / m);

  const p1 = m * s1 ** (m - 1) * s2 ** n * dilution_factor;

  const amountTokens2InCurrency = reservePrice
    ? ((p2 * tokens2) / 10 ** decimals2) * reservePrice
    : (p2 * tokens2) / 10 ** decimals2;

  const amountTokens1InCurrency = reservePrice
    ? ((p1 * tokens1) / 10 ** decimals1) * reservePrice
    : (p1 * tokens1) / 10 ** decimals1;

  const reserve_needed_in_сurrency =
    (reservePrice / 10 ** reserve_asset_decimals) * reserve_needed;

  return {
    amountTokens2InCurrency: amountTokens2InCurrency || 0,
    amountTokens1InCurrency: amountTokens1InCurrency || 0,
    s1init: initial_p2 ? s1init - supply1 / 10 ** decimals1 : s1init,
    reserve_needed,
    reserve_delta,
    fee,
    regular_fee,
    reward,
    p2,
    target_p2,
    new_distance,
    slow_capacity_share,
    fee_percent,
    reward_percent,
    payout,
    reserve_needed_in_сurrency,
  };
};
