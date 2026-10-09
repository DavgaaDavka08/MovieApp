import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Хуучин TMDB-д суурилсан хуудсуудын линкийг шинэ бүтэц рүү шилжүүлнэ
  async redirects() {
    return [
      {
        source: "/search",
        has: [{ type: "query", key: "value", value: "(?<q>.*)" }],
        destination: "/movies?q=:q",
        permanent: false,
      },
      { source: "/search", destination: "/movies", permanent: false },
      { source: "/seemorepopular", destination: "/movies?sort=popular", permanent: false },
      { source: "/seemoreup", destination: "/movies?sort=newest", permanent: false },
      { source: "/seemoretop", destination: "/movies?sort=popular", permanent: false },
      { source: "/genre/:path*", destination: "/movies", permanent: false },
      { source: "/catagory/:path*", destination: "/movies", permanent: false },
      { source: "/similar/:path*", destination: "/movies", permanent: false },
    ];
  },
};

export default nextConfig;
