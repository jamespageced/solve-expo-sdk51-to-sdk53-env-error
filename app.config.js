module.exports = {
  name: process.env.EXPO_PUBLIC_APP_NAME,
  slug: process.env.EXPO_PUBLIC_APP_SLUG,
  version: process.env.EXPO_PUBLIC_APP_VERSION,
  orientation: 'portrait',
  icon: `./assets/images/${process.env.EXPO_PUBLIC_APP_IOS_ICON}`,
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: `./assets/images/${process.env.EXPO_PUBLIC_APP_SPLASH_ICON}`,
    resizeMode: 'contain',
    backgroundColor: process.env.EXPO_PUBLIC_APP_SPLASH_ICON_BACKGROUNDCOLOR
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: `./assets/images/${process.env.EXPO_PUBLIC_APP_ADAPTIVE_ICON}`,
      backgroundColor: process.env.EXPO_PUBLIC_APP_ADAPTIVE_ICON_BACKGROUNDCOLOR
    },
    edgeToEdgeEnabled: true,
    package: process.env.EXPO_PUBLIC_APP_BUNDLE_IDENTIFIER,
    versionCode: Number(process.env.EXPO_PUBLIC_APP_ANDROID_VERSION_CODE)
  },
  web: {
    favicon: './assets/images/favicon.png'
  }
};
