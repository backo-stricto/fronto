Each Vue component should receive:

a normalized field definition from @fronto/core;
a modelValue where input applies;
disabled/read-only state;
validation messages.
Input components should:

support Vue v-model;
emit only JSON-compatible normalized values;
distinguish omitted/undefined state from explicit null according to the eventual core contract;
avoid HTTP requests and Backo-specific behavior.
@fronto/vue provides a registry that maps a core type identifier to its three Vue components. This is the seam that lets consumer projects customize behavior later.

fronto init
The initial command copies Vue SFC assets from Fronto `vue` package into a consumer application.

If the user's project root directory is `myproject_path/src/`, then :

- `myproject_path/src/fronto/components/base`: where all the base components assets will be copied.
- `myproject_path/src/fronto/components/items`: where the items components will be generated
- `myproject_path/src/fronto/components/overrides/base`: user-overrided base components
- `myproject_path/src/fronto/components/overrides/items`: user-overrided items components

The command should:

- resolve the component-source manifest exported by @fronto/vue;
- validate the selected target directory;
- copy SFCs and required helper files;
- create a manifest containing Fronto version, destination, file hashes, and format version;
- refuse accidental overwrites by default;
- offer an explicit overwrite option later.

The copied files become consumer-owned. Fronto should never silently replace their modifications.
A future synchronization/upgrade command might compare source hashes and propose updates.

The CLI should not automatically install Vue or Vuetify. It should detect missing/incompatible peer dependencies and report a clear instruction.
