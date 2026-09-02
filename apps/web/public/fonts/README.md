# Brand fonts

Three files go here. They are declared in
`packages/design-system/src/styles/fonts.css` and referenced from the token
stacks in `tokens.css`.

| File | Face | Role |
| --- | --- | --- |
| `new-order-bold.woff2` | New Order Bold | Primary. Body copy, UI, navigation. |
| `vcr-osd-mono.woff2` | VCR OSD Mono | Complementary. Banners, dates, durations, data. |
| `bunker-x.woff2` | Bunker X | Display. The wordmark and the large headlines. |

Convert whatever the brand kit ships (`.otf`, `.ttf`) to `woff2` — it is
roughly 30% smaller than the original and every browser in use supports it.

Until the files are here the site falls back to Barlow, IBM Plex Mono and IM
Fell English. It renders correctly, it is simply not in the brand's own type.

Check the licence before committing these: a webfont licence is separate from a
desktop one, and a repository is distribution.
