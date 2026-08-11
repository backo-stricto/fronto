# Fronto

## What it is about

Fronto application suite provides facilities for developing a frontend web application from a running `Backo` application server.

Fronto will provide at term 4 NPM packages:

- `@backo-stricto/fronto-core`: core logic upon which other packages rely on
- `@backo-stricto/fronto-cli`: CLI tools to use Fronto
- `@backo-stricto/fronto-vue`: Base frontend components based upon Vue.js bindings
- `@backo-stricto/fronto-generator`: Application specific components that derived from the user's Backo running application server ; not scheduled for implementation yet.

## Architecture

All the architectural choices and decisions are recorded under `docs/`.
More specifically ADRs (Architecture Decision Records) are recorded under `docs/architecture/decisions`.

## How to use it

Install the `@backo-stricto/fronto-cli` package.

Use the following command at your project's root to initialize it with fronto base components:

```bash
$ npx --package=@backo-stricto/fronto-cli -- init ./src
```
