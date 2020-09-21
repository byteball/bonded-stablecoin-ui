export const getTokens = (list) => {
  let tokens = [];
  for (let address in list) {
    if (
      list[address].params.reserve_asset === "base" &&
      list[address].reserve !== 0
    ) {
      tokens.push({
        asset: list[address].asset_2,
        symbol: list[address].symbol,
        interest_rate: list[address].params.interest_rate,
        reserve: list[address].reserve,
        address,
      });
    }
  }

  return tokens.sort((a, b) => b.reserve - a.reserve);
};
