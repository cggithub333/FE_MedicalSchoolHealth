import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@api': path.resolve(__dirname, 'src/api'),
      // '@services': path.resolve(__dirname, 'src/services'),
      // '@constants': path.resolve(__dirname, 'src/constants'),
      // '@styles': path.resolve(__dirname, 'src/styles'),
      // '@config': path.resolve(__dirname, 'src/config'),
    },
  },
});
