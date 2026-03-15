const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { PartnerWebpackPlugin } = require('../tools/webpack/partner-webpack-plugin');
const { loadPartnerEnv } = require('../tools/webpack/env-loader');

const PARTNER = process.env.PARTNER || 'administration';
const APP_NAME = 'administration';

process.env.PARTNER = PARTNER;

const partnerConfig = loadPartnerEnv(path.resolve(__dirname, '..'));

module.exports = {
  entry: path.resolve(__dirname, 'src/main.tsx'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],

    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json'),
        extensions: ['.tsx', '.ts', '.js'],
      }),
    ],

    alias: {
      '@bandi/component': path.resolve(__dirname, '../libs/ui/components'),
      '@bandi/theme': path.resolve(__dirname, '../libs/theme/index.ts'),
      '@bandi/interfaces': path.resolve(__dirname, '../libs/entities/index.ts'),
      '@bandi/store': path.resolve(__dirname, '../libs/ui/store/index.ts'),
      '@bandi/hooks': path.resolve(__dirname, '../libs/ui/hooks/index.ts'),
      '@bandi/utils': path.resolve(__dirname, '../libs/utils/index.ts'),
      '@bandi/services': path.resolve(__dirname, '../libs/services/index.ts'),
      '@bandi/pages/admin': path.resolve(__dirname, '../libs/ui/pages/admin'),
      '@bandi/pages/user': path.resolve(__dirname, '../libs/ui/pages/user'),
      '@bandi/pages/captain': path.resolve(__dirname, '../libs/ui/pages/captain'),
      '@bandi/pages/shared': path.resolve(__dirname, '../libs/ui/pages/shared'),
      'libs/ui/state': path.resolve(__dirname, '../libs/ui/state/index.ts'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          transpileOnly: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new PartnerWebpackPlugin(PARTNER),
    new webpack.DefinePlugin({
      APP_NAME: JSON.stringify(APP_NAME),
      PARTNER: JSON.stringify(PARTNER),
      'process.env.PARTNER': JSON.stringify(partnerConfig.partner || PARTNER),
      'process.env.PARTNER_ID': JSON.stringify(partnerConfig.partnerId),
      'process.env.PARTNER_NAME': JSON.stringify(partnerConfig.partnerName),
      __PARTNER_CONFIG__: JSON.stringify(partnerConfig),
    }),
  ],

  devServer: {
    static: path.resolve(__dirname, 'src'),
    hot: true,
    port: 1600,
    historyApiFallback: true,
  },

  mode: 'development',
};
