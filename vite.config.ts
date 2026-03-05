import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'implicit-page-tsx',
      resolveId(source, importer) {
        if (!importer || source.startsWith('\0')) return null;
        
        // Let Vite resolve the path first
        return this.resolve(source, importer, { skipSelf: true }).then((resolved) => {
           if (resolved) {
              // If it points to a directory (which often gets resolved to /index.js or nothing), 
              // we check if a page.tsx exists instead.
              if (resolved.id.endsWith('index.js') || resolved.id.endsWith('index.ts') || resolved.id.endsWith('index.tsx')) {
                  const dirPath = path.dirname(resolved.id);
                  const pageTsxPath = path.join(dirPath, 'page.tsx');
                  if (fs.existsSync(pageTsxPath)) {
                      return pageTsxPath;
                  }
              }
           }
           return null;
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Adding page.tsx to try and resolve directories implicitly if the custom plugin doesn't catch them
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '/page.tsx']
  },
  build: {
    outDir: "dist", // This is standard for Vite, Cloudflare will build from here.
  },
});
