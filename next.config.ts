import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default.
  // pdfjs-dist is loaded client-side only (dynamic import) so no server-side canvas mock is needed.
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://printfs.thenarcode.workers.dev/:path*',
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
