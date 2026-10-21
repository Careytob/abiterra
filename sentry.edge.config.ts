// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  sourcemaps: {
    deleteSourcemapsAfterUpload: true, // Ensures source maps are not included in the build
  },
};

Sentry.init({
  // Set NEXT_PUBLIC_SENTRY_DSN in your env to enable error reporting. With no DSN, Sentry stays disabled.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

module.exports = withSentryConfig({
  // Your Next.js config
}, sentryWebpackPluginOptions);
