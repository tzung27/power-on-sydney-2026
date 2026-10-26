"""Apply English blocks to clean Chinese fragments: frag-zh-backup/ -> frag/. Safe to re-run."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from en_d2 import EDITS

HERE = pathlib.Path(__file__).parent
SRC, DST = HERE / "frag-zh-backup", HERE / "frag"
bad = 0
for key, edits in EDITS.items():
    s = (SRC / f"{key}.html").read_text(encoding="utf-8")
    for anchor, closing, mode, html in edits:
        hits, pos = 0, 0
        while True:
            i = s.find(anchor, pos)
            if i < 0:
                break
            j = s.find(closing, i + (0 if anchor == closing else len(anchor)))
            if anchor == closing:
                j = i
            if j < 0:
                break
            at = j + len(closing) if mode == "after" else j
            s = s[:at] + html + s[at:]
            hits += 1
            pos = at + len(html) + len(closing)
        if hits == 0:
            bad += 1
            print(f"MISS {key}: {anchor[:40]}")
    (DST / f"{key}.html").write_text(s, encoding="utf-8")
    print(key, "ok", len(edits))
sys.exit(1 if bad else 0)
