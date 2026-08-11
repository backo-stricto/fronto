# ADR 0001 - Fronto init in user's project

## Status

Accepted

## Date

2026-08-05

## Context

What happens when a developer initializes its frontend project with Fronto.

## Decision

'init' Fronto CLI tool

- will copy basic types SFC into `fronto/base/` below user's project source directory.
- will create `fronto/overrides/` if it does not already exist, to allow the user to override SFC components easily.

`fronto.config.js` is a manifest containing Fronto version, destination, file hashes amd format versions.

## Consequences

Benefits
Clarify what does Fronto `init` CLI tool

## Alternatives

none

## Related ADRs:

none

## Tags:

- init
- basic
- components
- override

## Impact on the codebase

This decision affects:
User's project sources
