/** @type {import('next').NextConfig} */
const nextConfig = {};

const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  nextConfig,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  prettier: {
    plugins: ["prettier-plugin-tailwindcss"],
  },
  images: {
    domains: [
      "dev-peersuma-studio.s3.amazonaws.com",
      "peersuma-studio.s3.amazonaws.com",
      "shotstack-api-stage-output.s3-ap-southeast-2.amazonaws.com",
      "i.vimeocdn.com",
    ],
  },
});
