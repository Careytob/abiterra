// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Set NEXT_PUBLIC_SENTRY_DSN in your env to enable error reporting. With no DSN, Sentry stays disabled.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  sourcemaps: {
    deleteSourcemapsAfterUpload: true, // Ensures source maps are not included in the build
  },
};

module.exports = withSentryConfig({
  // Your Next.js config
}, sentryWebpackPluginOptions);
