const sentryWebpackPluginOptions = {
  sourcemaps: {
    disable: true, // Disables sourcemap uploads
  },
};
module.exports = withSentryConfig({}, sentryWebpackPluginOptions);
