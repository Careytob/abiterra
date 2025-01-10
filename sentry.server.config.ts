// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c0160c02b69b886ce7aabc322868f715@o4508596239597568.ingest.us.sentry.io/4508596254081024",

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
