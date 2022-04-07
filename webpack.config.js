const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

console.log(slsw.lib.entries)
module.exports = {
  context: __dirname,
  mode: env,
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
  // stats: {
  //   errorDetails: true
  // },
  resolve: {
    extensions: ['.ts'],
    symlinks: false,
    cacheWithContext: false,
    descriptionFiles: ['package.json'],
    alias: {
      '@': path.resolve(__dirname, "src"),
      '@root': path.resolve(__dirname)
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack', "src", "handlers"),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
          path.resolve(__dirname, '__test__'),
          path.resolve(__dirname, "bin")
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
          path.resolve(__dirname, '__test__'),
          path.resolve(__dirname, "bin")
        ],
        options: {
          esModule: false
        }
      }
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, "tsconfig.json")
      }
    })
  ],
};
