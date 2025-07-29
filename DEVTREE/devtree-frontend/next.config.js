/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // ✅ ACTIVA EL APP ROUTER
  },
  compiler: {
    styledComponents: true, // O bórralo si no lo usas
  },
};

export default nextConfig;
