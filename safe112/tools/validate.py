# -*- coding: utf-8 -*-
"""Check that all language files share the same keys, and JSON is valid."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "i18n"
LANGS = ["ko", "en", "zh-CN", "th", "ms", "vi"]


def walk_keys(obj, prefix=""):
    keys = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            path = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.extend(walk_keys(v, path))
            else:
                keys.append(path)
    return keys


def load(name):
    path = I18N / f"{name}.json"
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def main():
    errors = []
    data = {}
    for lang in LANGS:
        try:
            data[lang] = load(lang)
        except Exception as e:
            errors.append(f"{lang}.json parse error: {e}")
    if errors:
        print("\n".join(errors))
        raise SystemExit(1)

    ref = set(walk_keys(data["ko"]))
    print(f"ko keys: {len(ref)}")
    for lang in LANGS:
        keys = set(walk_keys(data[lang]))
        missing = sorted(ref - keys)
        extra = sorted(keys - ref)
        print(f"{lang}: {len(keys)} keys")
        if missing:
            errors.append(f"{lang} missing {len(missing)} keys, e.g. {missing[:8]}")
        if extra:
            errors.append(f"{lang} extra {len(extra)} keys, e.g. {extra[:8]}")

    crimes = json.loads((ROOT / "data" / "crimes.json").read_text(encoding="utf-8"))
    for cid in crimes["order"]:
        if cid not in data["ko"]["crimes"]:
            errors.append(f"crime id {cid} missing in ko.json")

    show = json.loads((ROOT / "data" / "show.json").read_text(encoding="utf-8"))
    for p in show["phrases"]:
        if p["id"] not in data["ko"]["show"]["phrases"]:
            errors.append(f"show phrase {p['id']} missing in ko.json")

    check = json.loads((ROOT / "data" / "checklist.json").read_text(encoding="utf-8"))
    for q in check["questions"]:
        if q not in data["ko"]["check"]["q"]:
            errors.append(f"checklist {q} missing in ko.json")

    jobs = json.loads((ROOT / "data" / "jobs.json").read_text(encoding="utf-8"))
    for j in jobs["cards"]:
        if j not in data["ko"]["jobs"]["cards"]:
            errors.append(f"job card {j} missing in ko.json")

    if errors:
        print("FAIL")
        print("\n".join(errors))
        raise SystemExit(1)
    print("OK: language keys and data ids match.")


if __name__ == "__main__":
    main()
