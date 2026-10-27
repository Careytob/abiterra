# Third-party licences

This project depends on open-source packages, each under its own licence. Summary of **production** dependencies (generated with `npx license-checker --production`; regenerate it after updating dependencies):

| Licence | Packages |
|---|---|
| MIT | 471 |
| Apache-2.0 | 53 |
| ISC | 32 |
| BSD-3-Clause | 5 |
| BSD-2-Clause | 5 |
| BlueOak-1.0.0 | 3 |
| LGPL-3.0-or-later | 2 |
| Hippocratic-2.1 | 2 |
| FSL-1.1-MIT | 2 |
| CC-BY-4.0 | 1 |
| MPL-2.0 | 1 |
| MIT-0 | 1 |
| 0BSD | 1 |
| (MIT OR CC0-1.0) | 1 |

## Packages worth a lawyer's attention

| Package | Licence | Why it matters |
|---|---|---|
| `react-leaflet`, `@react-leaflet/core` | Hippocratic-2.1 | An "ethical source" licence, **not** an OSI-approved open-source licence. It permits use but adds conditions about human-rights violations. Used for the map. Leaflet itself is BSD-2-Clause. |
| `@img/sharp-libvips-*` (via `sharp`) | LGPL-3.0-or-later | The image library `libvips`, loaded as a separate binary. Standard for `sharp`. |
| `next-mdx-remote` | MPL-2.0 | File-level copyleft; applies to changes to that package's own files, not to your code. |
| `@sentry/cli` | FSL-1.1-MIT | Build-time tool; the Functional Source License converts to MIT after two years and forbids only competing use. |
| `caniuse-lite` | CC-BY-4.0 | Browser-support data used by build tools. Attribution licence. |

No GPL or AGPL packages were found among production dependencies at the time of writing.

The map displays OpenStreetMap tiles, which require attribution ("© OpenStreetMap contributors"); the map component already includes it.
