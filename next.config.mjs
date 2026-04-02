/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Skip type-checking and linting during `next build`.
  // These run in your editor and CI — doing them again inside Docker
  // on a 1 vCPU server is what caused the 1-hour build time.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ["images.unsplash.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
