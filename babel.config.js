module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env.dev',
          blocklist: null,
          allowlist: null,
          blacklist: null, // DEPRECATED
          whitelist: null, // DEPRECATED
          safe: true,
          allowUndefined: true,
          verbose: true
        }
      ]
    ]
  };
};
