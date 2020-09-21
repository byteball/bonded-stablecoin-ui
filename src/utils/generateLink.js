import config from "../config";
import { encodeData } from "./encodeData";

export const generateLink = (amount, data, address, AA, asset) => {
  const sData = encodeData(data);
  return address
    ? `obyte${
        config.TESTNET ? "-tn" : ""
      }:${AA}?amount=${amount}&base64data=${encodeURIComponent(
        sData
      )}&from_address=${address}&asset=${asset || "base"}`
    : `obyte${
        config.TESTNET ? "-tn" : ""
      }:${AA}?amount=${amount}&base64data=${encodeURIComponent(sData)}&asset=${
        asset || "base"
      }`;
};
