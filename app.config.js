module.exports = {
  name: process.env.EXPO_PUBLIC_APP_NAME,
  slug: process.env.EXPO_PUBLIC_APP_SLUG,
  version: process.env.EXPO_PUBLIC_APP_VERSION,
  orientation: 'portrait',
  icon: `./assets/icon.png`,
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: `./assets/splash-icon.png`,
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: `./assets/adaptive-icon.png`,
      backgroundColor: '#ffffff'
    },
    edgeToEdgeEnabled: true,
    package: 'com.anonymous.demo'
  },
  web: {
    favicon: './assets/favicon.png'
  }
};
