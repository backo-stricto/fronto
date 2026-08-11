`core` package should define a normalized Fronto field model rather than exposing Vue props directly.

That model includes:

- type identifier, such as bool, int, float, string, datetime, bytes, or dict;
- field label, description, required and read-only state;
- JSON-compatible initial/current values;
- common constraints;
- type-specific settings, such as numeric bounds, regexes, or nested Dict fields;
- variant intent: display, input, or cell;
- structured validation messages, including nested paths.

This initial contract should be deliberately small. It must support basic components now without prematurely modeling Backo permissions, actions, CRUD, dynamic metadata, and item generation.
