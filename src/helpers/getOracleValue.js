export const getOracleValue = (oracles = [], ops = []) =>
  oracles.reduce((result, current, index) => {
    return ops[index] === "/" ? result / current : result * (current || 1);
  }, 1);
