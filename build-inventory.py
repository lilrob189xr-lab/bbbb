#!/usr/bin/env python3
"""Build the single final image inventory: docs/IMAGE-INVENTORY-FINAL.csv (+ prints a summary).
Reads the files that actually exist in assets-original/, src/data/assets.ts and src/data/catalog-manifest.json.
Nothing is deleted or modified. Requires Pillow."""
import csv, hashlib, json, os, re, glob
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AO = os.path.join(ROOT, "assets-original")
def md5(p): return hashlib.md5(open(p, "rb").read()).hexdigest()
def px(p):
    try: return "x".join(map(str, Image.open(p).size))
    except Exception: return ""
app_src = "".join(open(f, encoding="utf-8").read() for f in glob.glob(os.path.join(ROOT, "src", "app", "**", "*.tsx"), recursive=True))
def pages_for(key):
    out = []
    for name, needle in (("home", "page.tsx"),):
        pass
    for f in glob.glob(os.path.join(ROOT, "src", "app", "**", "page.tsx"), recursive=True):
        if key in open(f, encoding="utf-8").read():
            out.append("/" + os.path.relpath(os.path.dirname(f), os.path.join(ROOT, "src", "app")).replace("\\", "/").replace(".", ""))
    return sorted({o.rstrip("/") or "/" for o in out})

assets_ts = open(os.path.join(ROOT, "src", "data", "assets.ts"), encoding="utf-8").read()
earlier = {}
for m in re.finditer(r'\{ id: "(\w+)", originalPath: "([^"]+)", category: "([^"]+)", branch: ([^,}]+)(?:, note: "([^"]*)")?', assets_ts):
    earlier[m.group(1)] = dict(path=m.group(2), cat=m.group(3), branch=m.group(4).strip('"'), note=m.group(5) or "")

USAGE = {"logo": ("logo", "Header/footer/hero (transparent PNG derived; original backed up unchanged)"),
         "line-qr": ("use_on_site", "Contact page, original unmodified"),
         "branch": ("use_on_site", ""), "product-gold": ("draft_catalog", "Draft record, hidden until the owner publishes"),
         "service-gold-melting": ("use_on_site", "Naka branch (gold melting)"),
         "needs-decision": ("held_not_used", "Mixed items incl. watches; not published"),
         "excluded": ("excluded_never_shown", ""), "unused": ("not_used", "")}
rows = []
inv = list(csv.DictReader(open(os.path.join(AO, "ASSET-INVENTORY.csv"), encoding="utf-8-sig")))
for r in inv:
    fn = r["Original filename"]; key = fn[:8]; found = glob.glob(os.path.join(AO, "0*", "*", fn))
    a = earlier.get(key)
    if not found:
        rows.append(["earlier-upload", fn, "", r["MD5"], f'{r["Width"]}x{r["Height"]}', "MISSING_FROM_ARCHIVE", "", "Listed in the original ASSET-INVENTORY.csv (UNSORTED) but the file is not in the project archive. Owner: re-send if needed."]); continue
    p = found[0]; status, note = USAGE.get(a["cat"] if a else "", ("unclassified", ""))
    where = ",".join(pages_for(key)) if a and a["cat"] in ("branch", "line-qr", "service-gold-melting") else ""
    if a and a["cat"] == "branch" and key != "394AFAAD" and "/locations" not in where: where = ",".join(filter(None, [where, "/locations"]))
    if status == "use_on_site" and not where and a and a["cat"] != "line-qr": status = "available_not_placed"
    if key == "394AFAAD": where = ""; status, note = "not_placed", "Candid selfie; kept in the inventory, deliberately not placed (design decision, reversible)"
    if a and a["cat"] in ("unused", "excluded", "needs-decision") and a["note"]: note = a["note"]
    if a and a["cat"] == "product-gold": note = (a["note"] or note)
    rows.append(["earlier-upload", fn, os.path.relpath(p, ROOT), md5(p), px(p), status, where, note])

man = json.load(open(os.path.join(ROOT, "src", "data", "catalog-manifest.json"), encoding="utf-8"))
SM = {"integrated": ("draft_catalog", "Draft record (no name/code/price published)"), "about": ("use_on_site", "About page, genuine store photo (not a product image)"),
      "unpublished": ("unpublished_identified", "Identified (inventory only); never shown; Amulet Frames stays empty"), "duplicate": ("duplicate_not_used", "")}
for g in man["groups"]:
    for i in g["images"]:
        p = os.path.join(AO, "KAI_RICHY_DB_v4", "By_Product", g["folder"], i["file"])
        st, nt = SM[g["status"]]
        note = "; ".join(filter(None, [nt, g["holdReason"] or "", "; ".join(i["edits"]), i["flag"], "identification: " + g["ownerLabel"]]))
        where = "/about" if g["status"] == "about" else ("/products (review mode only)" if g["status"] == "integrated" else "")
        rows.append([f'owner-db-v4/{g["id"]}', i["ownerFilename"] or i["file"], os.path.relpath(p, ROOT), md5(p), px(p), st, where, note])
os.makedirs(os.path.join(ROOT, "docs"), exist_ok=True)
with open(os.path.join(ROOT, "docs", "IMAGE-INVENTORY-FINAL.csv"), "w", newline="", encoding="utf-8-sig") as fh:
    w = csv.writer(fh); w.writerow(["collection", "original_filename", "path_in_project", "md5", "pixels", "status", "used_on", "notes"]); w.writerows(rows)
from collections import Counter
print("rows", len(rows)); print(Counter(r[5] for r in rows)); print("by collection", Counter(r[0].split("/")[0] for r in rows))
