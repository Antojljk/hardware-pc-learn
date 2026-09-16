/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  async redirects() {
    return [
      { source: '/abonnements', destination: '/offres', permanent: true },
      { source: '/tarifs', destination: '/offres', permanent: true },
    ];
  },
};
export default nextConfig;
