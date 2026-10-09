1. Define the target UX

1. Keep one showcase app with two sections:
   Base components and Generated app components.

1. In Generated app components, show one card per generated item, with both display and input variants side by side.

1. Extend scan to index generated items

1. Update scan_command.ts to scan:
   fronto/components/items and fronto/components/overrides/items.

1. Generate an items registry file (for example alongside existing registry output).

1. Preserve override precedence rules (overrides/items wins over items).

1. Update showcase registry generation

1. Extend showcase_command.ts so showcase receives:
   base registry + items registry.

1. Also wire FIR data produced by generate (fronto.fir.json) so showcase can label/render item variants consistently.

1. Update showcase UI

1. Enhance Showcase.vue with a Generated components view.

1. Render discovered generated item components dynamically from the new items registry and FIR metadata.

1. Keep existing base grid unchanged.

1. Improve command workflow

1. Short term: document a standard sequence:
   generate -> scan -> showcase.

1. Medium term: add a convenience flag in generate to refresh registries/showcase automatically.

1. Add tests and fixture coverage

1. Add tests for item registry generation and override precedence.

1. Add a fixture based on your toy bool collection and validate generated showcase wiring.
