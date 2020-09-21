import symbol from "./symbol";
import asset from "./asset";
import decimals from "./decimals";
import support from "./support";
import number from "./number";

export const validator = ({
  value,
  type,
  onSuccess,
  onError,
  maxValue,
  minValue,
  isInteger,
  maxDecimals,
}) => {
  switch (type) {
    case "symbol": {
      return symbol(
        value,
        onSuccess ? () => onSuccess() : undefined,
        onError ? () => onError() : undefined
      );
    }
    case "asset": {
      return asset(
        value,
        onSuccess ? () => onSuccess() : undefined,
        onError ? () => onError() : undefined
      );
    }
    case "decimals": {
      return decimals(
        value,
        onSuccess ? () => onSuccess() : undefined,
        onError ? () => onError() : undefined
      );
    }
    case "support": {
      return support(
        value,
        onSuccess ? () => onSuccess() : undefined,
        onError ? () => onError() : undefined,
        maxValue
      );
    }
    case "number": {
      return number(
        value,
        onSuccess ? () => onSuccess() : undefined,
        onError ? () => onError() : undefined,
        maxValue,
        minValue,
        isInteger,
        maxDecimals
      );
    }
    default: {
      return symbol(
        value,
        onSuccess ? () => onSuccess() : undefined,
        onError ? () => onError() : undefined
      );
    }
  }
};
