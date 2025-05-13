/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      // Add other domains as needed, for example if using S3 for image storage
    ],
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