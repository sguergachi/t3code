# Android CI signing (sideload only)

`android-ci.keystore` is a **stable** keystore used by GitHub Actions to sign
sideload APKs published to the `android-latest` release.

## Why it exists

Android rejects an update when the new APK is signed with a different certificate
than the installed app (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`).

Generating a fresh keystore on every CI run made every APK uninstallable over
the previous one. This keystore is fixed so successive builds can update each
other.

## Credentials

| Field | Value |
| --- | --- |
| Store password | `t3code-ci-store` |
| Key password | `t3code-ci-store` |
| Alias | `t3code-ci` |

## Sideload package id

The Mobile APK workflow sets `T3CODE_ANDROID_PACKAGE_OVERRIDE=com.t3tools.t3code.sideload`
so the APK never conflicts with an older `com.t3tools.t3code` install that was
signed with a discarded one-off key.

Do **not** use this keystore for Play Store / EAS production uploads.
