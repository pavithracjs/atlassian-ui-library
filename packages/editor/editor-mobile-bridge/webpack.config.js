// @flow
/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const meow = require('meow');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const moduleResolveMapBuilder = require('@atlaskit/multi-entry-tools/module-resolve-map-builder');

const envPlugins = [];

const cli = meow({
  flags: {
    sourceMap: {
      type: 'boolean',
      alias: 's',
    },
    production: {
      type: 'boolean',
      alias: 'p',
    },
  },
});

const isProduction = cli.flags.production;
const mode = isProduction ? 'production' : 'development';

if (isProduction) {
  envPlugins.push(
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      sourceMap: cli.flags.sourceMap,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
        compress: {
          warnings: false,
        },
        output: {
          beautify: false,
        },
      },
    }),
  );
}

module.exports = async function createWebpackConfig() {
  return {
    mode,
    entry: {
      editor: './src/editor/index.tsx',
      renderer: './src/renderer/index.tsx',
      'error-reporter': './src/error-reporter.ts',
      'service-worker': './src/service-worker.ts',
      'service-worker-register': './src/service-worker-register.ts',
    },
    stats: {
      warnings: false,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/bundle'),
    },
    devtool: !isProduction || cli.flags.sourceMap ? 'source-map' : false,
    resolve: {
      mainFields: ['atlaskit:src', 'module', 'browser', 'main'],
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        ...(await moduleResolveMapBuilder()),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            babelrc: true,
            rootMode: 'upward',
            envName: 'production:esm',
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/editor.html.ejs'),
        chunks: ['error-reporter', 'editor'],
        chunksSortMode: 'manual',
        filename: 'editor.html',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/renderer.html.ejs'),
        chunks: ['error-reporter', 'renderer', 'service-worker-register'],
        chunksSortMode: 'manual',
        filename: 'renderer.html',
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ].concat(envPlugins),
  };
};
