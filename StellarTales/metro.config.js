const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  scheduler: require.resolve('scheduler'),
  'metro-runtime': path.resolve(__dirname, 'node_modules/metro-runtime'),
};

// Allow Metro to bundle binary .db files as assets
config.resolver.assetExts.push('db');

module.exports = config;
