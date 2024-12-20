/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
    TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: `/_next/static/media/`,
            outputPath: `${isServer ? '../' : ''}static/media/`,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;

