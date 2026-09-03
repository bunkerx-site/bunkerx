# Brand fonts

Declared in `packages/design-system/src/styles/fonts.css`, referenced from the
token stacks in `tokens.css`.

| File | Face | Role |
| --- | --- | --- |
| `bunker-x.woff2` | Bunker X | Display. Wordmark and large headlines. |
| `new-order-bold.woff2` | New Order Bold | Primary. Body copy, UI, navigation. |
| `vcr-osd-mono.woff2` | VCR OSD Mono | Complementary. Banners, dates, data. |

Convert with the helper rather than by hand — it checks the file is really a
font, reports whether the Portuguese accents are present, and writes woff2 here:

```
./apps/web/scripts/build-fonts.sh ~/Downloads/NewOrder-Bold.ttf new-order-bold
```

New Order and VCR OSD Mono are not in yet, so those stacks still fall back to
Barlow and IBM Plex Mono. Drop the Google Fonts import from `fonts.css` once
both arrive.
