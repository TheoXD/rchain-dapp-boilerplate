module.exports = {
    devServer: {
        disableHostCheck: true
    },
configureWebpack: config => {
    config.module.rules.push({
      test: "/.rho$/",
      use: [
        {
          loader: "raw-loader",
          options: {
            esModule: false
          }
        }
      ]
    });
  },
}