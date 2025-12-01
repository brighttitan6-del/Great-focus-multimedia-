import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely define only the API_KEY, preserving other process.env variables like NODE_ENV
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Define process.env as empty object to prevent "process is not defined" error in some libs
      'process.env': {}
    }
  };
});