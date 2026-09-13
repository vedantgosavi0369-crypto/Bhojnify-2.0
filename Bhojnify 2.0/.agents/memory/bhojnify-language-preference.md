---
name: Bhojnify language preference
description: The owner app supports a persisted English/Marathi UI preference while keeping stored user records unchanged.
---

Bhojnify’s language selection is part of the local owner workspace. New owners choose English or Marathi during onboarding, and existing owners can change it from Profile. The selected language is persisted with the local app state.

**Why:** The app is local-first and owner-only, so language preference belongs with the workspace rather than a remote account.

**How to apply:** Translate interface copy, labels, alerts, navigation, and display-only seeded values through the shared translation layer. Never mutate owner-entered names, notes, ingredient names, or other stored records just to change the UI language.