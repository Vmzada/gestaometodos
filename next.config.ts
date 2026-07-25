import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Allows the local dev server to be driven through an HTTPS tunnel
  // (needed while testing the Mercado Pago checkout redirect locally).
  allowedDevOrigins: ["timely-amanda-referral-fellow.trycloudflare.com"],
};

export default nextConfig;
