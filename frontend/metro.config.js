const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for modern ES modules from three and react-three-fiber
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;
