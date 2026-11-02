# Fronto

## What it is about

Fronto application suite provides facilities for developing a frontend web application from a running `Backo` application server.

Fronto is composed by 3 NPM packages:

- `@backo-stricto/fronto-core`: core logic upon which other packages rely on
- `@backo-stricto/fronto-cli`: CLI tools for components installations, components scanning and app's components generation
- `@backo-stricto/fronto-vue`: Base frontend components based upon Vue.js bindings

## Architecture

All the architectural choices and decisions are recorded under `docs/`.
More specifically ADRs (Architecture Decision Records) are recorded under `docs/architecture/decisions`.

## How to use it

Install the `@backo-stricto/fronto-cli` package.

### Initialize your project with Fronto base components

Use the following command at your project's root to initialize it with fronto base components:

When using `npm`:

```bash
$ npx --package=@backo-stricto/fronto-cli fronto -- init <project_src_root_path>
```

When using `pnpm` (version >= 11), replace `npx` by `pnx`.

Basically it will copy the Fronto base components assets into your project, below `<argument_path>/fronto`.

### Scan the components and create the registry

When using `npm`:

```bash
npx --package=@backo-stricto/fronto-cli fronto -- scan <project's src root path>
```

When using `pnpm` (version >= 11), replace `npx` by `pnx`.

It will scan `<project's src root path>/fronto` and create both `registry.ts` (base components) and `registry.items.ts` (generated item components) below `<project's src root path>/fronto/components`.

### Create the showcase mini-app

It allows the user to visualize the components being used, and their overriden version if any.

When using `npm`:

```bash
npx --package=@backo-stricto/fronto-cli fronto -- showcase -f <path to Fronto components in user's project> -d <destination path of the Showcase mini-app>
```

When using `pnpm` (version >= 11), replace `npx` by `pnx`.

A fully standalone minimal showcase app will be setup.
Go to `<destination path>/showcase` and run `npm i` to install dependencies.

Then run `npm run dev` to visualize the app at `http://localhost:5173`

## Quick Startup

1. Create the user's project

    ```bash
    $ mkdir /tmp/myproject
    $ cd /tmp/myproject
    ```

    If using `npm`:

    ```bash
    $ npm init --yes
    $ npm add /data/scm/MyProjects/fronto/packages/core/backo-stricto-fronto-core-0.1.0.tgz
    ```

    if using `pnpm`:

    ```bash
    $ pnpm init --init-type module --yes
    $ pnpm add /data/scm/MyProjects/fronto/packages/core/backo-stricto-fronto-core-0.1.0.tgz
    ```

1. Install the base Fronto components

    ```bash
    $ node ./packages/cli/dist/index.js install /tmp/myproject --framework vue
    ```

1. Scan the components to create the registry

    ```bash
    $ node ./packages/cli/dist/index.js scan /tmp/myproject
    ```

1. Create the `Showcase` app

    ```bash
    $ node ./packages/cli/dist/index.js showcase --fronto /tmp/myproject/fronto/components --destination /tmp/myproject/
    ```

1. Install the `Showcase` dependencies and run the app:

    If using `npm`:

    ```bash
    $ cd showcase
    $ npm install
    $ npm run dev
    ```

    If using `pnpm`:

    ```bash
    $ cd showcase
    $ pnpm install
    $ pnpm run dev
    ```

1. Run the Backo-backed API Server app

    It should be probably something like:

    ```bash
    cd <project-path>
    uv run python [...]
    ```

1. Generate the application's components:

    ```bash
        $ node ./packages/cli/dist/index.js generate /tmp/myproject -b http://localhost:5000 -p http://localhost:5173 -n fronto_toy_app
    ```

1. Re-scan the components tree to make them available for `Showcase`:

    ```bash
    $ node ./packages/cli/dist/index.js scan /tmp/myproject
    ```

1. Ensure the `Showcase` app is running at `http://localhost:5173`
