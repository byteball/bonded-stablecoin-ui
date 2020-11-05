let config = {
  TESTNET: process.env.REACT_APP_TESTNET === "true",
  FACTORY_AAS: process.env.REACT_APP_FACTORY_AAS.split(","),
  TOKEN_REGISTRY: process.env.REACT_APP_TOKEN_REGISTRY,
  SIMPLESWAP_API_KEY: process.env.REACT_APP_SIMPLESWAP_API_KEY,
  BUFFER_URL: process.env.REACT_APP_BUFFER_URL,
  STATS_URL: process.env.REACT_APP_STATS_URL,
  GA_ID: process.env.REACT_APP_GA,
  reserves: {
    base: {
      name: "GBYTE",
      decimals: 9,
      oracle: process.env.REACT_APP_RESERVE_ORACLE,
      feed_name: process.env.REACT_APP_RESERVE_FEED_NAME,
      feedCurrency: "USD",
    },
    [process.env.REACT_APP_OUSD_RESERVE_ASSET || '']: {
      name: "OUSD",
      decimals: 4,
    },
    [process.env.REACT_APP_OBIT_RESERVE_ASSET || '']: {
      name: "OBIT",
      decimals: 8,
    },
    [process.env.REACT_APP_OAU_RESERVE_ASSET || '']: {
      name: "OAU",
      decimals: 8,
    },
  },
  interestRecipients: process.env.REACT_APP_TESTNET === "true" ?
  [
    {
      name: "testnet distribution address",
      address: "5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD"
    },
  ]
  :
  [
    { name: "Obyte Foundation", address: "FCXZXQR353XI4FIPQL6U4G2EQJL4CCU2" },
    {
      name: "Estonian Cryptocurrency Association",
      address: "VJDEB7JEBHJWW6DPTLYYUBDAVOYKZYB4",
    },
    {
      name: "PolloPollo",
      address: "UB6CSL6DSZPMACGZDEUKE4RLVWNXUPAJ",
    },
  ],
  // for landing page
  pegged: process.env.REACT_APP_TESTNET === "true" ?
  {
    USD: {
      stableName: "OUSD",
      interestName: "IUSD",
      growthName: "GRD",
      percent: 16,
      address: "7FSSFG2Y5QHQTKVRFB3VWL6UNX3WB36O",
    },
    BTC: {
      stableName: "TOBIT",
      interestName: "TIBIT",
      growthName: "TGRB",
      percent: 11,
      address: "YMH724SHU7D6ZM4DMSP5RHQYB7OII2QQ",
    },
    GOLD: {
      stableName: "OAU",
      interestName: "IAU",
      growthName: "GRAU",
      percent: 1,
      address: "VE63FHFCPXLLXK6G6HXQDO5DVLS2IDOC",
    }
  }
  :
  {
    USD: {
      stableName: "OUSD",
      interestName: "IUSD",
      growthName: "GRD",
      percent: 16,
      address: "26XAPPPTTYRIOSYNCUV3NS2H57X5LZLJ",
    },
    BTC: {
      stableName: "OBIT",
      interestName: "IBIT",
      growthName: "GRB",
      percent: 11,
      address: "Z7GNZCFDEWFKYOO6OIAZN7GH7DEKDHKA",
    },
    GOLD: {
      target: "ounce of gold",
      stableName: "OAU",
      interestName: "IAU",
      growthName: "GRAU",
      percent: 8,
      address: "UCWEMOXEYFUDDBJLHIHZ3NIAX3QD2YFD",
    },
    GBYTE: {
      stableName: "OGB",
      interestName: "IGB",
      growthName: "GRGB",
      percent: 16,
      address: "UH6SNZMZKHWMRM7IQZGFPD5PQULZZSBI",
    },
    'GBYTE leveraged 2x': {
      stableName: "GB2",
      interestName: "GB2",
      growthName: "GRGB2",
      percent: 0,
      address: "MCZAGO47NLPO25KOOJHN22PNKEGLQ6XV",
    },
    'CMC marketcap': {
      target: 'CMC total marketcap in billions',
      stableName: "OCMC",
      interestName: "OCMC",
      growthName: "GRCMC",
      percent: 0,
      address: "RC6N2RHP32DBL5G2JN3OREZBSUNPV5WQ",
      nonGbyteReserve: true,
    },
  },
  oracleInfo: process.env.REACT_APP_TESTNET === "true" ? { 
    "F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N":{
      name: "[TESTNET] Cryptocurrency oracle",
      description: "The oracle is operated by Tony Churyumoff, the founder of Obyte, since 2017. It is also an Order Provider on Obyte network."
    }
  } : {
    "JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC":{
      name: "Cryptocurrency oracle",
      description: "The oracle is operated by Tony Churyumoff, the founder of Obyte, since 2017. It is also an Order Provider on Obyte network."
    },
    "DXYWHSZ72ZDNDZ7WYZXKWBBH425C6WZN":{
      name: "Precious metals oracle",
      description: "The oracle is operated by Bind Creative. It is also an Order Provider on Obyte network."
    },
  }
};

// cleanup empty reserve .env config values
config.reserves = Object.keys(config.reserves)
  .filter(asset => asset)
  .reduce((accum, asset) => {
    const newConfig = accum;
    newConfig[asset] = config.reserves[asset];
    return newConfig;
  }, {});

export default config;
