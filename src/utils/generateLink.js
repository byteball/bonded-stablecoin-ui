import config from "../config";
import { encodeData } from "./encodeData";

export const generateLink = (amount, data, address, AA, asset, is_single) => {
  const sData = encodeData(data);
  return `obyte${
        config.TESTNET ? "-tn" : ""
      }:${AA}?amount=${amount}&base64data=${encodeURIComponent(
        sData
      )}&from_address=${address || ''}&single_address=${is_single ? '1' : '0'}&asset=${asset || "base"}`;
};
