# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
ko = json.loads((root / "i18n/ko.json").read_text(encoding="utf-8"))
js = (root / "js/app.js").read_text(encoding="utf-8")
keys = re.findall(r't(?:Ko)?\("([^"]+)"\)', js)


def get(obj, path):
    cur = obj
    for p in path.split("."):
        if not isinstance(cur, dict) or p not in cur:
            return None
        cur = cur[p]
    return cur


missing = []
for k in sorted(set(keys)):
    if " + " in k:
        continue
    if k.endswith(".") or k.endswith(".title") and k.startswith("crimes."):
        pass
    dynamic = False
    for token in ("crimes.\" +", "jobs.cards.\" +", "check.q.\" +", "show.phrases.\" +", "report.c"):
        pass
    if get(ko, k) is None:
        missing.append(k)

print("static t() count", len(set(keys)))
print("missing", missing)
print("tel:112 in app.js", "tel:112" in js)
print("clipboard", "clipboard" in js)
print("localStorage in i18n", "localStorage" in (root / "js/i18n.js").read_text(encoding="utf-8"))

# required crime fields
need = ["title", "short", "what", "warningSigns", "dont", "actions", "policeTip"]
crimes = json.loads((root / "data/crimes.json").read_text(encoding="utf-8"))
for cid in crimes["order"]:
    block = ko["crimes"][cid]
    for f in need:
        if f not in block:
            print("crime missing field", cid, f)
        elif f in ("warningSigns", "dont", "actions") and not isinstance(block[f], list):
            print("not list", cid, f)
print("done")
