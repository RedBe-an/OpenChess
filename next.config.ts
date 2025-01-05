import nextMDX from '@next/mdx';

const nextConfig: import('next').NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async rewrites() {
    const rewrites = {
      beforeFiles: [],
      afterFiles: [
        // apply any of your existing rewrites here
      ],
      fallback: [] as { source: string; destination: string; }[]
    };

    // dev only, this allows for local api calls to be proxied to
    // api routes that use rust runtime
    if (process.env.NODE_ENV === 'development') {
      rewrites.fallback.push({
        source: '/api/:path*',
        destination: 'http://0.0.0.0:3001/api/:path*'
      });
    }

    return rewrites;
  }
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig)