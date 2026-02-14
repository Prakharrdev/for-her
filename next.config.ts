import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'perkkk.dev',
          },
        ],
        destination: 'https://sakura.perkkk.dev/:path*',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
