import { useState, useEffect } from "react";
import config from "config";

export const useGetDeposits = (state, decimals2, min_deposit_term, challenge_immunity_period, activeWallet) => {
  const [myDeposits, setMyDeposits] = useState([]);
  const [otherDeposits, setOtherDeposits] = useState([]);
  
  useEffect(() => {
    const deposits = {};
    const forceClose = {};
    for (let row in state) {
      if (row.includes("_force_close")) {
        const id = row.split("_")[1];
        if (id === "force") continue;
        forceClose[id] = { ...state[row] };
      } else if (row.includes("deposit_")) {
        const id = row.split("_")[1];
        deposits[id] = { ...state[row] };
      }
    }

    for (let id in forceClose) {
      if (id in deposits) {
        deposits[id].close_interest = forceClose[id].interest;
        deposits[id].force_close_ts = forceClose[id].ts;
      }
    }

    const my = [];
    const other = [];

    const entriesDeposits = Object.entries(deposits);
    for (let id in deposits) {
      const protection_ratio = ((deposits[id].protection || 0) / 10 ** config.reserves.base.decimals) / (deposits[id].amount / 10 ** decimals2);

      if (deposits[id].close_interest) {
        const weaker = entriesDeposits.find(([weakerId, vars]) => {
          const protection_withdrawal_ts = vars.protection_withdrawal_ts || 0;
          if (!vars.interest && (vars.ts + min_deposit_term + challenge_immunity_period < deposits[id].force_close_ts) && (protection_withdrawal_ts < (deposits[id].force_close_ts - challenge_immunity_period))) {
            const weaker_protection_ratio = ((vars.protection || 0) / 10 ** config.reserves.base.decimals) / (vars.amount / 10 ** decimals2);
            if (weaker_protection_ratio < protection_ratio) {
              return weakerId;
            }
          }
        });

        if (weaker) deposits[id].weakerId = weaker[0]
      }

      if (
        deposits[id].owner === activeWallet ||
        deposits[id].interest_recipient === activeWallet
      ) {
        my.push({ id, ...deposits[id], protection_ratio, key: id, isMy: true });
      } else {
        other.push({ id, ...deposits[id], protection_ratio, key: id, isMy: false });
      }
    }

    setMyDeposits(my);
    setOtherDeposits(other);
  }, [state, activeWallet, decimals2, min_deposit_term, challenge_immunity_period]);

  return [myDeposits, otherDeposits]
};