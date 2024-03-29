const { resolve } = require('path');

require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const env = process.env.NODE_ENV;
const isDevMode = (env && env.toLowerCase() === "development");

let config = {
  mode: "production",

  entry: {
    'hyenaGRPC': resolve("./src/", "hyenaGRPC")
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  target: 'node',

  node: {
    __dirname: false,
    __filename: false
  },

  externals: nodeExternals(),

  devtool: "",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude:  /node_modules/
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { 
        from: resolve("./src", "configs"),
        to: 'configs',
        ignore: [
          ".gitkeep"
        ]
      },
      { 
        from: resolve("./src", "models"),
        to: 'models',
        ignore: [
          ".gitkeep"
        ]
      },
      { 
        from: resolve("./src", "statics"),
        to: 'statics',
        ignore: [
          ".gitkeep"
        ]
      }
    ]),

  ],

  output: {
    path: resolve('./dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js'
  }


}

if (isDevMode) {
  config.mode = "development";
  config.devtool = "eval";
}

module.exports = config;
