// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    WS_URL: process.env.WS_URL,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  redirects: async () => {
    return [
      {
        source: "/w",
        destination: "/w/home",
        permanent: true,
      },
      {
        source: "/signin",
        destination: "/auth/signin",
        permanent: true,
      }
    ];
  },
};
export default config;