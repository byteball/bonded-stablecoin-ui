const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#0037ff', "@text-color" : "#333333", '@statistic-content-font-size' : '16px', '@margin-sm': '5px' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
};