import type { Metadata } from "next";

const config = {
  async redirects() {
    return [
      {
        source: "/features",
        destination: "/en/solutions",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/assistant",
        destination: "/en/digital-products",
        permanent: true,
      },
      // Redirect old non-locale routes to English versions
      {
        source: "/solutions",
        destination: "/en/solutions",
        permanent: true,
      },
      {
        source: "/industries",
        destination: "/en/industries",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/en/about",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/en/work",
        permanent: true,
      },
      {
        source: "/digital-products",
        destination: "/en/digital-products",
        permanent: true,
      },
    ];
  },
};

export default config;
