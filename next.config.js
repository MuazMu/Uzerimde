/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'api.avaturn.me',
      'api.fashn.ai',
      'api.sizer.me',
      'example.com',
      // Add other domains as needed, for example if using S3 for image storage
    ],
  },
  env: {
    NEXT_PUBLIC_AVATURN_API_KEY: process.env.NEXT_PUBLIC_AVATURN_API_KEY,
    NEXT_PUBLIC_FASHN_API_KEY: process.env.NEXT_PUBLIC_FASHN_API_KEY,
    NEXT_PUBLIC_SIZER_API_KEY: process.env.NEXT_PUBLIC_SIZER_API_KEY,
    NEXT_PUBLIC_RPM_SUBDOMAIN: process.env.NEXT_PUBLIC_RPM_SUBDOMAIN || 'uzerimde',
  },
  webpack(config) {
    // This allows the app to handle GLB and other 3D file formats
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files',
          outputPath: 'static/files',
          name: '[name].[hash].[ext]',
        },
      },
    });

    // Add a rule to handle the three-mesh-bvh module
    config.module.rules.push({
      test: /three-mesh-bvh/,
      use: 'null-loader'
    });

    return config;
  },
};

module.exports = nextConfig; 