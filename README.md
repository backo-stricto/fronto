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

### Initialize your project with Fronto base components

Use the following command at your project's root to initialize it with fronto base components:

```bash
$ npx --package=@backo-stricto/fronto-cli fronto -- init <project's src root path>
```

Basically it will copy the Fronto base components assets into your project, below `<argument_path>/fronto`.

### Scan the components and create the registry

```bash
npx --package=@backo-stricto/fronto-cli fronto -- scan <project's src root path>
```

It will scan `<project's src root path>/fronto` and create a `registry.ts` below `<project's src root path>/fronto/components`.

### Create the showcase mini-app

It allows the user to visualize the components being used, and their overriden version if any.

```bash
npx --package=@backo-stricto/fronto-cli fronto -- showcase -f <path to Fronto components in user's project> -d <destination path of the Showcase mini-app>
```

A fully standalone minimal showcase app will be setup.
Go to `<destination path>/showcase` and run `npm i` to install dependencies.

Then run `npm run dev` to visualize the app at `http://localhost:5173`

## Quick Startup

1. Create the user's project

    ```bash
    $ mkdir /tmp/myproject
    $ cd /tmp/myproject
    $ npm init --yes
    $ npm add /data/scm/myprojects/fronto/packages/core/backo-stricto-fronto-core-0.1.0.tgz
    $ cd showcase
    $ npm install
    $ npm run dev
    ```

1. Install the Fronto components into the user's project

    ```bash
    $ node ./packages/cli/dist/index.js install /tmp/myproject --framework vue
    ```

1. Scan the components for overrides

    ```bash
    $ node ./packages/cli/dist/index.js scan /tmp/myproject
    ```

1. Produce the base showcase app

    ```bash
    $ node ./packages/cli/dist/index.js showcase --fronto /tmp/myproject/fronto/components --destination /tmp/myproject/
    ```

1. After running the user's app which present a REST API, generate the application's components

```bash
    $ node ./packages/cli/dist/index.js generate /tmp/myproject -u http://localhost:5000 -n fronto_toy_app
```
