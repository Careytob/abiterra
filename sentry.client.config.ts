// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Set NEXT_PUBLIC_SENTRY_DSN in your env to enable error reporting. With no DSN, Sentry stays disabled.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

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
