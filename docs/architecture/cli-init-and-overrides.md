CLI `init` tool description:

- argument: source directory of the user's project
- actions:
    - copy the basic types components under `<project's source directory>/fronto/components/base`
    - if inexistent, create the directories
        - `<project's source directory>/fronto/components/items`
        - `<project's source directory>/fronto/components/overrides/base`
        - `<project's source directory>/fronto/components/overrides/items`

base/ — tool-managed baseline components;
overrides/ — developer-owned replacements.

Components in `fronto/components/overrides/base/` take precedence over their original version under `fronto/components/base/`.
Same logic for `items` components : `fronto/components/overrides/items/` takes over `fronto/components/items/`.

Initial types:

| Stricto type | Vue behavior                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| Bool         | Boolean display, switch/checkbox input, concise icon/text cell                                                |
| Int          | Strict integer input; reject decimal values; support min/max                                                  |
| Float        | Numeric input; preserve numeric model values; support min/max                                                 |
| String       | Text display/input/cell; required, description, regex, and supported enum metadata                            |
| Datetime     | ISO-8601 UTC values at the package boundary; locale-aware display; input emits strings ending in Z            |
| Bytes        | Base64-string contract; file-picker input asynchronously converts files to base64; multipart support deferred |
| Dict         | Recursive composition of basic components from nested field definitions; compact summary cell                 |
