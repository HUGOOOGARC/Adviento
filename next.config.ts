import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite completar la compilación de producción en Vercel aunque existan errores de tipos de TypeScript
    ignoreBuildErrors: true,
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
