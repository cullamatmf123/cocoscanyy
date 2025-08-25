// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

// Get the default config
const config = getDefaultConfig(__dirname);

// Add bin to assetExts for TensorFlow.js model files
config.resolver.assetExts.push('bin');

module.exports = config;