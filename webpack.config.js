const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // Other configurations
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};