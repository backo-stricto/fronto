We will make use of pnpm workspaces in the single Fronto repository.

- Build ESM packages with TypeScript declaration files.
- Build @fronto/cli as an executable Node package.
- Publish locally with the normal npm publish flow after pack/install verification.
- Use package-specific tags for independent releases, for example @fronto/core@0.1.0.

GitHub Actions parses the tag, validates lint/tests/build/package contents, then publishes only the tagged package using npm trusted publishing and provenance.

CI should run on pull requests and the main branch:

- dependency installation;
- formatting/lint;
- type checking;
- unit and component tests;
- complete build;
- package-content verification.
