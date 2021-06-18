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

export const $get_p2 = (s1, s2, dilution_factor, m, n, isV2) => {
  if (isV2) {
    return Decimal(s1).pow(m).mul(n).mul(Decimal(s2).pow(n - 1)).toNumber()
  } else {
    return (
      dilution_factor *
      s1 ** m *
      n *
      (Number.isInteger(n * 2) ? Math.sqrt(s2 ** ((n - 1) * 2)) : s2 ** (n - 1))
    );
  }
};

export const $get_fee = (
  avg_reserve,
  old_distance,
  new_distance,
  fee_multiplier
) => Decimal(fee_multiplier).mul(avg_reserve).mul(new_distance - old_distance).mul(new_distance + old_distance).toNumber()

export const $get_reserve = (s1, s2, m, n, dilution_factor, isV2) => {
  if (isV2) {
    return Decimal(s1).pow(m).mul(Decimal(s2).pow(n)).toNumber();
  }
  return Decimal(dilution_factor).mul(Decimal(s1).pow(m).mul(Decimal(s2).pow(n))).toNumber();
};

export const $get_growth_factor = (
  interest_rate,
  timestamp,
  rate_update_ts,
  growth_factor
) => {
  if (growth_factor === undefined) return 0
  const term = Decimal(timestamp - rate_update_ts).div(360 * 24 * 3600);
  return Decimal(growth_factor).mul(Decimal(1 + interest_rate).pow(term)).toNumber();
};

export const $get_target_p2 = (
  oracle_price,
  leverage,
  interest_rate,
  timestamp,
  rate_update_ts,
  growth_factor
) => {
  if (!oracle_price) return false
  return Decimal(oracle_price).pow(leverage - 1)
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

export const $get_distance = (p2, target_p2, isV2) => (p2 && target_p2) ? Math.abs(p2 - target_p2) / (isV2 ? Math.min(p2, target_p2) : target_p2): 0;

export const $get_exchange_result = ({
  tokens1,
  tokens2,
  tokens_stable,
  vars,
  params,
  oracle_price,
  timestamp,
  reservePrice,
  isV2,
  addReserve
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
    reserve_asset,
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
  const new_growth_factor = $get_growth_factor(interest_rate, timestamp, rate_update_ts, growth_factor);
  const distance =
    initial_p2 !== undefined && target_p2 ? $get_distance(initial_p2, target_p2, isV2) : 0;

  if (tokens_stable) tokens2 += tokens_stable / new_growth_factor;

  const new_supply1 = supply1 + tokens1;
  const new_supply2 = supply2 + tokens2;

  const s1 = new_supply1 / 10 ** decimals1;
  const s2 = new_supply2 / 10 ** decimals2;

  const old_s1 = supply1 / 10 ** decimals1;
  const old_s2 = supply2 / 10 ** decimals2;

  const r = $get_reserve(s1, s2, m, n, dilution_factor, isV2);
  let p2 = $get_p2(s1, s2, dilution_factor, m, n, isV2);
  const new_reserve = Math.ceil(r * 10 ** reserve_asset_decimals);
  const reserve_delta = new_reserve - reserve;
  const new_distance = target_p2 ? $get_distance(p2, target_p2, isV2) : 0;
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
    new_fast_capacity = fast_capacity + Decimal(regular_fee).mul(fast_capacity_share).toNumber();
    distance_share = 1 - Decimal(distance).div(new_distance).toNumber();
    // reward that would be paid for returning the price back to $initial_p2
    reverse_reward = Decimal(distance_share).mul(new_fast_capacity).toNumber();

    if (regular_fee >= reverse_reward) {
      fee = regular_fee;
    } else {
      fee = Decimal.ceil(
        Decimal(distance_share)
          .div(1 - distance_share * fast_capacity_share)
          .mul(fast_capacity)
      ).toNumber();
    }
    reserve_needed = reserve_delta + fee; // negative for payouts
  } else {
    // going towards the target price - get a reward
    fee = 0;
    reward = Decimal.floor((1 - Decimal(new_distance).div(distance).toNumber()) * fast_capacity);
    reserve_needed = reserve_delta - reward; // negative for payouts
  }

  const turnover = $get_turnover(-reserve_delta, tokens1, tokens2, p2);
  let fee_percent = fee ? Decimal(fee).div(turnover).mul(100).toNumber() : 0;
  let reward_percent = (reward / turnover) * 100;
  const network_fee = isV2 ? 4e3 : 1e3;
  const full_network_fee = network_fee;

  const reserve_asset_amount = reserve_asset === "base" ? 1e4 - full_network_fee : 0;

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

  const p1 = m * s1 ** (m - 1) * s2 ** n * (dilution_factor || 1);
  const old_p1 = m * old_s1 ** (m - 1) * old_s2 ** n * (dilution_factor || 1);

  const amountTokens2InCurrency = reservePrice
    ? ((p2 * tokens2) / 10 ** decimals2) * reservePrice
    : (p2 * tokens2) / 10 ** decimals2;

  const amountTokens1InCurrency = reservePrice
    ? ((p1 * tokens1) / 10 ** decimals1) * reservePrice
    : (p1 * tokens1) / 10 ** decimals1;

  const reserve_needed_in_сurrency = reservePrice
    ? (reservePrice / 10 ** reserve_asset_decimals) * reserve_needed
    : reserve_needed / 10 ** reserve_asset_decimals;


  const getReserveNeeded = (T2) => {
    let fee,
      reward,
      reserve_needed,
      regular_fee,
      new_fast_capacity,
      distance_share,
      reverse_reward;
    
    const newS2 = (supply2 + T2) / 10 ** decimals2;
    const r = $get_reserve(old_s1, newS2, m, n, dilution_factor, isV2);
    const p2 = $get_p2(old_s1, newS2, dilution_factor, m, n, isV2);
    const new_reserve = Math.ceil(r * 10 ** reserve_asset_decimals);
    const new_distance = target_p2 ? Decimal(Math.abs(p2 - target_p2)).div(isV2 ? Math.min(target_p2, p2) : target_p2).toNumber() : 0;
    const avg_reserve = Decimal(reserve + new_reserve).div(2).toNumber();
    const reserve_delta = new_reserve - reserve;

    if (distance === 0 && new_distance === 0) {
      fee = 0;
      reward = 0;
      reserve_needed = reserve_delta;
    } else if (new_distance >= distance) {
      // going away from the target price - pay a fee
      reward = 0;
      regular_fee = $get_fee(avg_reserve, distance, new_distance, fee_multiplier);
      new_fast_capacity = fast_capacity +
        Decimal(regular_fee).mul(fast_capacity_share).toNumber();
      distance_share = 1 - Decimal(distance).div(new_distance).toNumber();
      // reward that would be paid for returning the price back to $initial_p2
      reverse_reward = Decimal(distance_share).mul(new_fast_capacity).toNumber();

      if (regular_fee >= reverse_reward) {
        fee = regular_fee;
      } else {
        fee = Decimal.ceil(
          Decimal(distance_share)
            .div(1 - distance_share * fast_capacity_share)
            .mul(fast_capacity)
        ).toNumber();
      }
      reserve_needed = reserve_delta + fee; // negative for payouts
    } else {
      // going towards the target price - get a reward
      fee = 0;
      reward = Decimal.floor((1 - Decimal(new_distance).div(distance).toNumber()) * fast_capacity).toNumber();
      reserve_needed = reserve_delta - reward; // negative for payouts
    }
    const turnover = $get_turnover(-reserve_delta, 0, T2, p2);
    const fee_percent = fee ? Decimal(fee).div(turnover).mul(100).toNumber() : 0;
    const reward_percent = (reward / turnover) * 100;
    return { amount: Math.ceil(reserve_needed), fee_percent, reward_percent, reward, p2 };
  }

  let expectNewT2;

  if (addReserve && addReserve > 0) {

    const startS2 = ((reserve + addReserve) / (old_s1 ** m * 10 ** reserve_asset_decimals)) ** (1 / n)

    const startT2 = startS2 * 10 ** decimals2 - new_supply2;

    let a = 0;
    let b = startT2 * 2;
    let i = 0

    const eps = 1;
    const max_iterations = 100;
    
    while (true) {
      let c = Decimal(a + b).div(2).toNumber();
      if (getReserveNeeded(c).amount > addReserve) {
        b = c;
      } else {
        a = c;
      }

      if (Math.abs(a - b) <= eps) {
        expectNewT2 = Math.trunc(b);
        const info = getReserveNeeded(c);
        fee_percent = info.fee_percent;
        reward = info.reward;
        reward_percent = info.reward_percent;
        p2 = info.p2;
        break;
      } else if (i >= max_iterations) {
        break;
      }
      i++;
    }
  }

  return {
    amountTokens2InCurrency: amountTokens2InCurrency || 0,
    amountTokens1InCurrency: amountTokens1InCurrency || 0,
    s1init: initial_p2 ? s1init - supply1 / 10 ** decimals1 : s1init,
    reserve_needed,
    tokens2: tokens2,
    reserve_delta,
    fee,
    regular_fee,
    reward,
    p2,
    p1,
    old_p1,
    target_p2,
    new_distance,
    slow_capacity_share,
    fee_percent,
    reward_percent,
    payout,
    expectNewT2: expectNewT2,
    reserve_needed_in_сurrency,
    growth_factor: new_growth_factor,
  };
};