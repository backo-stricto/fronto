Read the relevant architecture documents before altering package boundaries:

- @fronto/core must not import Vue, Vuetify, DOM APIs, or template code.
- @fronto/vue owns Vue/Vuetify adapters
- @fronto/cli owns filesystem and command behavior.

Do not modify consumer-owned overrides/ files.

Add or update fixtures and tests when supporting a new Stricto type.

Do not implement live Backo API generation in the current milestone.
