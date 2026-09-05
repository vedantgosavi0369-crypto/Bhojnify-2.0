---
name: MessMate first-build boundary
description: The initial mobile experience is intentionally local-first, with native device verification where available and server sync/auth/push deferred.
---

The first MessMate build uses device-local persistence so all student and owner workflows remain usable without a backend. Attendance uses native foreground location and biometrics on supported devices; web preview uses a clearly labeled local preview path. Shared accounts, server-backed records, and push expiry reminders are separate follow-up work.

**Why:** The SRS spans a complete operations product, but an offline-capable mobile first build gives the user a working surface quickly without inventing a partial server contract.

**How to apply:** Preserve the local workflow contract when adding API sync. Keep location access limited to the explicit attendance event, and replace the in-app expiry notice with opt-in push only when shared membership data and permissions are available.

The current product scope is mess-owner-only. Student navigation and student submission flows are intentionally removed; attendance and member feedback remain as owner-visible records where useful. Inventory follow-up reminders are local records with a due date and explicit Resolve action.

**Why:** The user wants to operate the mess from one owner workspace before introducing student accounts or shared workflows.

**How to apply:** Keep new features owner-facing and local-first unless the user explicitly reintroduces student access or asks for shared synchronization.