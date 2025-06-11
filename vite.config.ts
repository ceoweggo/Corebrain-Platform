import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// Importamos los plugins de postcss directamente
import tailwindcssNesting from 'tailwindcss/nesting';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Definir isProduction basado en el modo
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/auth': {
          target: isProduction ? 'https://sso.globodain.com' : 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcssNesting,
          tailwindcss,
          autoprefixer,
        ],
      },
    },
    optimizeDeps: {
      include: ['tailwindcss/nesting']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  };
});