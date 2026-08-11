Fronto is typescript project that aligns with 2 complementary projects: Stricto (https://github.com/backo-stricto/stricto) and Backo (https://github.com/backo-stricto/backo). Stricto is mainly used as a foundation by Backo for types definitions.
Backo is python framework designed for generating easily Applications servers that publish a REST API.

Fronto is a framework for generating automatically web frontend components (based on a popular frontend framework like Vue.js or React) for a running Backo application. It will rely upon a library of basic web components that come standard with Fronto packages and that wrap basic types defined by Stricto. Data models exposed by Backo application API routes are a composition of Stricto basic types.

Depending on its underlying frontend framework, fronto will embed basic web components for each basic types used in the application (numbers, strings, emails, ...).

A basic component is derived in 3 variants :

- `display`: read-only ouput
- `input`: editable form control
- `cell`: compact table/list representation

A developer will make use of Fronto like this:

- initialize its own frontend project sources with the Fronto basic components ; basically the Fronto CLI command 'init' copies them under the project's sources directory into a separate directory.
  At this step he must choose between the available Fronto variants whose underlying frontend framework against which they are built (Vue.js, React,...)
- generate the specialized web components from the data gathered by requesting the API routes of the related Backo application. These components reflect the data models exposed by the Backo-based application, featuring application-specific API route calls to the Backo application.

Then the developer builds the frontend by assembling the fronto-generated web components.

Fronto is a monorepo containing several independently publishable npm packages.
