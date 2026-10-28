// Large-screen support (Play "large screen quality"): the app must resize freely (split-screen,
// foldables, free-form windows) and rotate. Expo's default manifest leaves resizeableActivity
// unset; this states it so the behaviour does not depend on defaults. Orientation itself is
// "default" in app.json (no portrait lock).
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withLargeScreens(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application?.[0];
    if (app) app.$['android:resizeableActivity'] = 'true';
    return cfg;
  });
};
