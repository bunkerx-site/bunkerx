#!/usr/bin/env bash
#
# Converts the brand's TTF/OTF files to woff2 and puts them where the site
# expects them.
#
# woff2 is roughly half the size of the original and every browser in use
# supports it, so the site never ships a ttf. The conversion needs fonttools,
# which is Python — it is installed into a throwaway virtualenv rather than
# added as a project dependency, because this runs once per font, not per build.
#
# Usage:  ./scripts/build-fonts.sh ~/Downloads/NewOrder-Bold.ttf new-order-bold
#         ./scripts/build-fonts.sh ~/Downloads/VCR_OSD_MONO.ttf vcr-osd-mono
#
set -euo pipefail

SRC="${1:?caminho do arquivo .ttf ou .otf}"
NAME="${2:?nome de saída sem extensão, ex: new-order-bold}"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/../public/fonts/$NAME.woff2"
VENV="${TMPDIR:-/tmp}/bunkerx-fonttools"

[ -f "$SRC" ] || { echo "arquivo não encontrado: $SRC"; exit 1; }

# A Google Drive shortcut is a couple of hundred bytes and is not a font. This
# has already happened once; catching it here beats debugging a broken @font-face.
SIZE=$(wc -c < "$SRC" | tr -d ' ')
if [ "$SIZE" -lt 4096 ]; then
  echo "erro: $SRC tem apenas ${SIZE} bytes."
  echo "provavelmente é um atalho do Google Drive, não a fonte. baixe o arquivo real."
  exit 1
fi

[ -d "$VENV" ] || python3 -m venv "$VENV"
"$VENV/bin/pip" install -q fonttools brotli

"$VENV/bin/python" - "$SRC" "$OUT" <<'PY'
import sys, os
from fontTools.ttLib import TTFont

src, dst = sys.argv[1], sys.argv[2]
font = TTFont(src)

names = {r.nameID: str(r) for r in font['name'].names if r.platformID == 3}
cmap = set()
for table in font['cmap'].tables:
    cmap |= set(table.cmap.keys())

# A Portuguese site that cannot render "ã" or "ç" is broken, and a display face
# missing them is a common and expensive surprise. Report it now.
missing = [c for c in 'áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ' if ord(c) not in cmap]

print(f"  família : {names.get(1)} {names.get(2) or ''}")
print(f"  glifos  : {len(cmap)}")
print(f"  acentos : {'todos presentes' if not missing else 'FALTANDO ' + ''.join(missing)}")
licence = names.get(13) or names.get(14)
if licence:
    print(f"  licença : {licence[:120]}")

font.flavor = 'woff2'
font.save(dst)
before, after = os.path.getsize(src), os.path.getsize(dst)
print(f"  gravado : {dst} ({after:,} bytes, {100 - after * 100 // before}% menor)")
PY
