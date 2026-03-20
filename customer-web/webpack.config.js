const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

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
      '@bandi/component':   path.resolve(__dirname, '../libs/ui/components'),
      '@bandi/theme':       path.resolve(__dirname, '../libs/theme/index.ts'),
      '@bandi/interfaces':  path.resolve(__dirname, '../libs/entities/index.ts'),
      '@bandi/store':       path.resolve(__dirname, '../libs/ui/store/index.ts'),
      '@bandi/hooks':       path.resolve(__dirname, '../libs/ui/hooks/index.ts'),
      '@bandi/utils':       path.resolve(__dirname, '../libs/utils/index.ts'),
      '@bandi/services':    path.resolve(__dirname, '../libs/services/index.ts'),
      '@bandi/pages/user':  path.resolve(__dirname, '../libs/ui/pages/user'),
      '@bandi/pages/shared':path.resolve(__dirname, '../libs/ui/pages/shared'),
      'libs/ui/state':      path.resolve(__dirname, '../libs/ui/state/index.ts'),
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
    new webpack.DefinePlugin({
      APP_NAME: JSON.stringify('customer'),
      'process.env.PARTNER': JSON.stringify('customer'),
    }),
  ],

  devServer: {
    static: path.resolve(__dirname, 'src'),
    hot: true,
    port: 1800,
    historyApiFallback: true,
  },

  mode: 'development',
};
