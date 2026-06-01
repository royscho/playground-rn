declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
    APP_ENV: 'development' | 'staging' | 'production';
    SENTRY_DSN: string;
    SENTRY_ORG: string;
    SENTRY_PROJECT: string;
    CODEPUSH_SERVER_URL: string;
    SOCKET_IO_URL: string;
  }
  const Config: NativeConfig;
  export default Config;
}
