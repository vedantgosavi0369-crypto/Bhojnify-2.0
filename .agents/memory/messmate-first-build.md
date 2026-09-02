---
name: MessMate first-build boundary
description: The initial mobile experience is intentionally local-first, with native device verification where available and server sync/auth/push deferred.
---

The first MessMate build uses device-local persistence so all student and owner workflows remain usable without a backend. Attendance uses native foreground location and biometrics on supported devices; web preview uses a clearly labeled local preview path. Shared accounts, server-backed records, and push expiry reminders are separate follow-up work.

**Why:** The SRS spans a complete operations product, but an offline-capable mobile first build gives the user a working surface quickly without inventing a partial server contract.

**How to apply:** Preserve the local workflow contract when adding API sync. Keep location access limited to the explicit attendance event, and replace the in-app expiry notice with opt-in push only when shared membership data and permissions are available.