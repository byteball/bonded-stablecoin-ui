export const redirect = (url) => {
  if (url) {
    // eslint-disable-next-line no-useless-escape
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
      window.open(url).close();
    } else {
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    }
  }
};
