# Why Showcase

Showcase is a developer-oriented application whose purpose is to demonstrate the base Fronto components, eventually overridden by the user.

# Workflow

## Installation

### fronto-core package dependency resolution

Fronto-core package dependency resolution is up to the hosting application (the application under which 'Showcase' app is installed in a sub-directory).
Since Fronto components are located in a sibling directory relatively to Showcase app, the 'fronto-core' dependency must be resolved at user's app level (root `package.json`).

Since the package `fronto-core` is hosted on Github, `@backo-stricto` domain resolution must be configured to be sourced from that repository with a `.npmrc` configuration located in the project's root:

```bash
@backo-stricto:registry=https://npm.pkg.github.com
always-auth=true
```

Hence the dependency in `package.json`:

```json
"dependencies": {
        "@backo-stricto/fronto-core": "^0.1.0",
        [...]
```

will source the package from the Github package registry instead of the default `npmjs`.

Beforehand you have to set your Github PAT (Personal Access Token) with `read:packages` permission so that you're allowded to source the dependency.

```bash
$ pnpm config set "//npm.pkg.github.com/:_authToken" <token_value>
```

#### Manual dependency resolutio (developer mode)

Firstly build the `fronto-core` package:

```bash
$ pnpm --filter @backo-stricto/fronto-core run build
```

Then produce the package archive:

```bash
$ cd packages/core
$ pnpm pack
```

A file like `backo-stricto-fronto-core-<version>.tgz` should be produced.

#### In installed Showcase app

- Remove reference to the Github repo : `mv .npmrc .npmrc_disabled`
- Remove dependency line `fronto-core` in `package.json`
- Add the dependency to the package archive:

```bash
$ pnpm add <path_to_fronto-core_archive>
```

- Proceed with installation: `npm install`

### Showcase app installation

Make sure the `fronto` CLI is available in your project.

```bash
$ npx @backo-stricto/fronto-cli showcase \
    --fronto <path to your project fronto/components directory> \
    --project-root <your project root path>
```

The generated Showcase app depends on `@backo-stricto/fronto-core` hosted on GitHub Packages.
Before installing dependencies in the Showcase folder, export a token with `read:packages` permission:

```bash
$ export NODE_AUTH_TOKEN=<your_github_packages_token>
```

Then run dependency installation from the Showcase directory:

```bash
$ cd <your project root>/showcase
$ npm install
```

### Run Showcase

```bash
$ npm run dev
```

And open a browser on `http://localhost:5173`.

## Troubleshooting

If `@backo-stricto/fronto-core` cannot be resolved:

```bash
# Check scope registry mapping
$ npm config get @backo-stricto:registry

# Validate your token against GitHub Packages
$ npm whoami --registry=https://npm.pkg.github.com

# Confirm package is installed in showcase app
$ npm ls @backo-stricto/fronto-core
```
