import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  esbuild: {
    loader: 'jsx', // Enables JSX for `.js` files
    include: [
      'src/**/*.{js,jsx,ts,tsx}',
      'node_modules/expo-router/**',
      'node_modules/react-native/**',
    ],
  },
});
