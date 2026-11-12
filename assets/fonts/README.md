# Self-hosted fonts

Copied without modification from npm packages published by Fontsource:

| Family | Package | Package version | Upstream metadata version | Normal Latin weights |
| --- | --- | --- | --- | --- |
| Sora | @fontsource/sora | 5.3.0 | v17 | 600, 700 |
| Manrope | @fontsource/manrope | 5.3.0 | v20 | 400, 600, 700 |
| IBM Plex Mono | @fontsource/ibm-plex-mono | 5.3.0 | v20 | 400, 500 |

Each family directory includes the complete, unmodified package `LICENSE`
(SIL Open Font License 1.1, SPDX `OFL-1.1`). No font renaming, conversion,
subsetting, or other modification was performed. Only the requested static
Latin normal WOFF2 files are distributed by this site.

`MANIFEST.json` records download URLs, npm integrity values, SHA-256 hashes,
file sizes, and exact package member paths for every distributed font and
license. Package versions are distinct from the upstream metadata versions.

Fontsource package repository:
<https://github.com/fontsource/font-files/tree/main/fonts/google>

Upstream font projects:

- Sora: <https://github.com/sora-xor/sora-font>
- Manrope: <https://github.com/sharanda/manrope>
- IBM Plex: <https://github.com/IBM/plex>

The site loads `assets/fonts.css` through the shared site stylesheet. Every
font source is a local relative WOFF2 URL with `font-display: swap`. No Google
Fonts request, remote CSS import, JavaScript loader, or production package
dependency is required. Characters outside these Latin subsets use the site's
existing fallback fonts.
