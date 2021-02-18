import { useState, useEffect } from "react";
import moment from "moment";

export const useGetDeposits = (state, decimals2, min_deposit_term, challenge_immunity_period, reserve_asset_decimals, activeWallet) => {
  const [myDeposits, setMyDeposits] = useState([]);
  const [allDeposits, setAllDeposits] = useState([]);
  const [minProtectionRatio, setMinProtectionRatio] = useState(null);
  const timestamp = moment().unix();

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
        deposits[id].closer = forceClose[id].closer;
      }
    }

    const my = [];
    const all = [];
    let minRatio = null;

    const entriesDeposits = Object.entries(deposits);
    for (let id in deposits) {
      const protection_ratio = ((deposits[id].protection || 0) / 10 ** reserve_asset_decimals) / (deposits[id].amount / 10 ** decimals2);

      if (deposits[id].closer) {
        const weaker = entriesDeposits.find(([weakerId, vars]) => {
          const protection_withdrawal_ts = vars.protection_withdrawal_ts || 0;
          if (!vars.closer && (vars.ts + min_deposit_term + challenge_immunity_period < deposits[id].force_close_ts) && (protection_withdrawal_ts < (deposits[id].force_close_ts - challenge_immunity_period))) {
            const weaker_protection_ratio = ((vars.protection || 0) / 10 ** reserve_asset_decimals) / (vars.amount / 10 ** decimals2);
            if (weaker_protection_ratio < protection_ratio) {
              return weakerId;
            }
          }
          return false
        });

        if (weaker) deposits[id].weakerId = weaker[0]
      }

      if (deposits[id].owner === activeWallet){
        my.push({ id, ...deposits[id], protection_ratio, key: id, isMy: true });
      }

      all.push({ id, ...deposits[id], protection_ratio, key: id });

      if(!deposits[id].closer && deposits[id].ts + min_deposit_term < timestamp){
        if(minRatio !== null){
          if(minRatio > protection_ratio){
            minRatio = protection_ratio;
          }
        } else {
          minRatio = protection_ratio; 
        }
      }
    }

    setMyDeposits(my);
    setAllDeposits(all);
    setMinProtectionRatio(minRatio);
  }, [state, activeWallet, decimals2, min_deposit_term, challenge_immunity_period, reserve_asset_decimals]);

  return [myDeposits, allDeposits, minProtectionRatio];
};