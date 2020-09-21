export const generateOraclesString = (initial, governance) => {
  if (governance) {
    return governance
      .map((o) => {
        return o.oracle + o.op + o.feed_name;
      })
      .join(" ");
  } else {
    return [
      initial.oracle1 + initial.op1 + initial.feed_name1,
      initial.oracle2 ? initial.oracle2 + initial.op2 + initial.feed_name2 : "",
      initial.oracle3 ? initial.oracle3 + initial.op3 + initial.feed_name3 : "",
    ].join(" ");
  }
};
