import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yapetelegram.com',
  appName: 'yape',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
