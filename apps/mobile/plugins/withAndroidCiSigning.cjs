const path = require("node:path");
const { withAppBuildGradle } = require("expo/config-plugins");

/**
 * Wire release signing to the committed CI keystore when building sideload APKs.
 *
 * Without this, CI either left release APKs unsigned or generated a new keystore
 * every run — which makes Android refuse updates (INSTALL_FAILED_UPDATE_INCOMPATIBLE).
 *
 * Enabled only when T3CODE_ANDROID_CI_SIGNING=1 so local/EAS release signing is
 * unaffected.
 */
module.exports = function withAndroidCiSigning(config) {
  if (process.env.T3CODE_ANDROID_CI_SIGNING !== "1") {
    return config;
  }

  return withAppBuildGradle(config, (nextConfig) => {
    if (nextConfig.modResults.language !== "groovy") {
      throw new Error("withAndroidCiSigning only supports Groovy build.gradle");
    }

    // app/build.gradle lives at apps/mobile/android/app/build.gradle, so the
    // committed keystore at apps/mobile/ci/android-ci.keystore is ../../ci/.
    const signingBlock = `
// --- T3 Code CI signing (stable sideload key; do not use for Play Store) ---
def t3CiKeystore = file("\${rootProject.projectDir}/../ci/android-ci.keystore")
android {
    signingConfigs {
        ciRelease {
            storeFile t3CiKeystore
            storePassword "t3code-ci-store"
            keyAlias "t3code-ci"
            keyPassword "t3code-ci-store"
        }
    }
    buildTypes {
        release {
            // Always use the stable CI key for sideload APKs when this plugin runs.
            signingConfig signingConfigs.ciRelease
        }
    }
}
// --- end T3 Code CI signing ---
`;

    if (nextConfig.modResults.contents.includes("T3 Code CI signing")) {
      return nextConfig;
    }

    nextConfig.modResults.contents = `${nextConfig.modResults.contents.trimEnd()}\n${signingBlock}\n`;
    return nextConfig;
  });
};
