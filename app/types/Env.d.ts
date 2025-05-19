declare module '@env' {
  export const MOBILE_ENV: string;
  export const EXPO_AUTH_SESSION_TENANT_ID: string;
  export const EXPO_AUTH_SESSION_CLIENT_ID: string;
  export const EXPO_AUTH_SESSION_SCOPE_URL: string;
  export const EXPO_AUTH_SESSION_ANDROID_PATH: string;
  export const EXPO_AUTH_SESSION_IOS_NATIVE: string;
  export const AMS_MOBILE_API: string;
  export const AMS_PRODUCT_API: string;
  export const AMS_MOBILE_SCANDIT_LICENSE_KEY: string;
  export const AMS_365_SCANDIT_LICENSE_KEY: string;
}
declare var process: {
  env: {
    NODE_ENV: string;
  };
};
