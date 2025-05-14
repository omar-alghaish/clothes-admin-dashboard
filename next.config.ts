const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard for any domain
      },
    ],
  },
};

module.exports = nextConfig;