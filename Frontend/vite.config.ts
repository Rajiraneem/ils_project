import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),        // React support (SWC compiler)
    tailwindcss(),  // Tailwind CSS
  ],
});
