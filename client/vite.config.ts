import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //  checker({
    //   typescript: true,
    // }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    ,
    tsconfigPaths(),
  ],
});
