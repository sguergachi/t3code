# Android CI signing

`android-ci.keystore` is a **stable, non-Play-Store** keystore used only for
GitHub Actions sideload APKs.

## Why it exists

Android refuses to install an update when the new APK is signed with a different
certificate than the installed app (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`).

The previous CI workflow generated a fresh keystore on every run, so every
release APK had a new signature and could not update an existing install.

## Credentials (CI only)

| Field | Value |
| --- | --- |
| Store password | `t3code-ci-store` |
| Key password | `t3code-ci-store` (PKCS12) |
| Alias | `t3code-ci` |

Do **not** use this keystore for Play Store / production distribution. Upload
keys for store releases belong in EAS / secrets, not this file.
