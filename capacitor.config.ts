import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fooddelivery.app',
  appName: 'Food Delivery',
  webDir: 'out',
  server: {
    // Development: Компьютеріңіздің IP адресін қойыңыз (мысалы: http://192.168.1.15:3000)
    // Production: Vercel сілтемесін қойыңыз
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;