#!/usr/bin/env python3
"""Prepare the owner's organized product photos (assets-original/KAI_RICHY_DB_v4) for the website.

The owner's folders, groups and file names are never changed or deleted. Output:
  public/images/catalog/<KR-id>/   card / gallery / thumb JPEGs for groups marked "integrated"
  image-package/refined/           the same for every group, plus WebP (not served by the site)
  docs/IMAGE_INDEX.csv, docs/contact-sheets/, src/data/catalog-manifest.json
Enhancement is color-neutral: mild denoise, luminance-only exposure/contrast, light sharpening.
Only two edits change content: cropping out baked-in price/spec text overlays (see OVERLAY_CROPS).
Requires Pillow, numpy, opencv-python.
"""
import csv, hashlib, json, os, shutil
import numpy as np, cv2
from PIL import Image, ImageOps, ImageFilter, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-original", "KAI_RICHY_DB_v4")
PUB = os.path.join(ROOT, "public", "images", "catalog")
PKG = os.path.join(ROOT, "image-package", "refined")
DOCS = os.path.join(ROOT, "docs")

# Owner decisions (Phase 4 final, Nov 18 2026). All remaining groups are owner-approved for identification and placement.
#  integrated  = draft catalog record (hidden until the owner publishes it; no name/code/price shown)
#  unpublished = identified in the inventory, never shown on the site (frames / amulet imagery; Amulet Frames stays empty)
#  about       = genuine photo used on the About page, not as a product
#  duplicate   = byte-identical to another image; kept in the inventory, not used twice
STATUS = {"KR-006": "unpublished", "KR-007": "unpublished", "KR-015": "unpublished", "KR-016": "duplicate", "KR-STORE": "about"}
HOLD = {
    "KR-006": "Owner-confirmed gold frame. Frames/amulet items are not published and Amulet Frames stays empty until the owner authorizes it",
    "KR-007": "Hollow gold frames (set of three). Not published; Amulet Frames stays empty until the owner authorizes it",
    "KR-015": "Buddha amulet pendant (front and inscribed reverse). Not published; Amulet Frames stays empty until the owner authorizes it",
    "KR-016": "Exact duplicate of KR-003_06 (the belt). Not used twice",
    "KR-STORE": "Genuine store photo for the About page (owner-approved); not a product image",
}
# Owner-confirmed / evidence-based identification (inventory only; none of this is published as product text)
LABEL_FIX = {
    "KR-006": "Gold frames on a tray (owner-confirmed gold frame)",
    "KR-007": "Hollow gold frames, set of three",
    "KR-014": "Mixed gold pieces on a tray (owner labels of KR-014 and KR-016 were swapped)",
    "KR-015": "Buddha amulet pendant, front and inscribed reverse",
    "KR-016": "Duplicate of KR-003_06 (belt)",
    "KR-017": "Jubilee diamond ring (owner-confirmed genuine Jubilee item)",
    "KR-STORE": "Store staff photo (About page)",
}
TYPE_FIX = {"KR-006": "Gold Frame", "KR-014": "Mixed Gold", "KR-017": "Ring"}
ROTATE = {"KR-006_01_main": -90, "KR-006_02_detail": -90}  # photos were stored sideways
# Baked-in price/spec text removed by cropping (fractions of the image: left, top, right, bottom).
OVERLAY_CROPS = {
    "KR-002_01_main": (0, 0, 1, 0.74),
    "KR-008_02_detail": (0, 0, 1, 0.60),
    "KR-009_01_main": (0, 0, 1, 0.72),
    "KR-017_01_main": (45 / 368, 405 / 800, 275 / 368, 693 / 800),  # whole ring and stone with a margin; price slip stays out
}
FLAGS = {
    "KR-001_01_main": "visible handwritten date tag and card numbers on the watch papers (owner to decide on blurring)",
    "KR-001_02_detail": "visible handwritten date tag and card numbers",
    "KR-001_03_detail": "visible handwritten date tag and card numbers",
    "KR-001_04_detail": "visible handwritten date tag and card numbers",
    "KR-003_06_detail": "exact duplicate of KR-016_01_main (KR-016 is retired as a duplicate)",
    "KR-017_01_main": "original contains a price slip; cropped to the ring only",
}
TYPE_MAP = {"Watch": "watch", "Ring": "ring", "Belt": "belt", "Pendant": "pendant", "Necklace": "necklace",
            "Earrings": "earrings", "Silverware": "other", "Jewelry Set": "set", "Gold Set": "set", "Gold Frame": "other", "Mixed Gold": "other"}
CARD = (480, 600); THUMB = (240, 300); GALLERY_MAX = 1000

def enhance(im):
    arr = cv2.fastNlMeansDenoisingColored(np.asarray(im), None, 4, 4, 5, 15)
    im = Image.fromarray(arr)
    y, cb, cr = im.convert("YCbCr").split()
    y = ImageOps.autocontrast(y, cutoff=0.2)
    ya = np.asarray(y).astype(np.float32) / 255.0
    g = float(np.clip(np.log(0.47) / np.log(max(ya.mean(), 0.05)), 0.92, 1.06))
    y = Image.fromarray((np.power(ya, g) * 255).astype(np.uint8))
    im = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
    return im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=50, threshold=2))

def cover(im, size, focus=(0.5, 0.5)):
    tw, th = size; w, h = im.size; s = max(tw / w, th / h)
    r = im.resize((max(tw, round(w * s)), max(th, round(h * s))), Image.LANCZOS)
    x = round((r.width - tw) * focus[0]); y = round((r.height - th) * focus[1])
    return r.crop((x, y, x + tw, y + th))

def save(im, path, webp_path=None, q=84):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, quality=q, optimize=True, progressive=True)
    if webp_path:
        os.makedirs(os.path.dirname(webp_path), exist_ok=True); im.save(webp_path, "WEBP", quality=80, method=6)

def md5(p): return hashlib.md5(open(p, "rb").read()).hexdigest()

idx = list(csv.DictReader(open(os.path.join(SRC, "Reports", "IMAGE_INDEX.csv"), encoding="utf-8-sig")))
db = {r["product_id"]: r for r in csv.DictReader(open(os.path.join(SRC, "Reports", "PRODUCT_DATABASE.csv"), encoding="utf-8-sig"))}
groups = {}
for folder in sorted(os.listdir(os.path.join(SRC, "By_Product"))):
    pid = folder.split("_")[0]
    files = sorted(f for f in os.listdir(os.path.join(SRC, "By_Product", folder)) if f.lower().endswith(".jpg"))
    rows = [r for r in idx if r["product_id"] == pid]
    groups[pid] = {"id": pid, "folder": folder, "ownerType": TYPE_FIX.get(pid, db[pid]["category"]), "ownerLabel": LABEL_FIX.get(pid, db[pid]["name_visible"]),
                   "status": STATUS.get(pid, "integrated"), "holdReason": HOLD.get(pid), "images": []}
    for n, f in enumerate(files):
        stem = f[:-4]; role = "main" if "_main" in f else "detail"
        orig = rows[n]["filename"] if n < len(rows) else ""
        sp = os.path.join(SRC, "By_Product", folder, f)
        im0 = ImageOps.exif_transpose(Image.open(sp)).convert("RGB")
        edits = []
        if stem in ROTATE:
            im0 = im0.rotate(ROTATE[stem], expand=True); edits.append("rotated upright (stored sideways)")
        if stem in OVERLAY_CROPS:
            l, t, r_, b = OVERLAY_CROPS[stem]; W, H = im0.size
            im0 = im0.crop((round(l * W), round(t * H), round(r_ * W), round(b * H))); edits.append("price/spec text overlay cropped out")
        im = enhance(im0)
        g = im.copy(); g.thumbnail((GALLERY_MAX, GALLERY_MAX), Image.LANCZOS)
        card = cover(im, CARD); thumb = cover(im, THUMB)
        out = {}
        for name, v, q in (("gallery", g, 86), ("card", card, 84), ("thumb", thumb, 80)):
            rel = f"{pid}/{stem}-{name}.jpg"
            save(v, os.path.join(PKG, rel), os.path.join(PKG, "webp", f"{pid}/{stem}-{name}.webp"), q)
            if groups[pid]["status"] in ("integrated", "about"): save(v, os.path.join(PUB, rel), None, q)
            out[name] = {"src": f"/images/catalog/{rel}", "width": v.width, "height": v.height}
        groups[pid]["images"].append({"file": f, "stem": stem, "role": role, "sort": n + 1, "ownerFilename": orig,
            "md5": md5(sp), "origWidth": Image.open(sp).width, "origHeight": Image.open(sp).height,
            "edits": edits, "flag": FLAGS.get(stem, ""), "variants": out})

json.dump({"source": "KAI_RICHY_DB_v4", "groups": list(groups.values())}, open(os.path.join(ROOT, "src", "data", "catalog-manifest.json"), "w"), ensure_ascii=False, indent=1)

# IMAGE_INDEX.csv (v5): the owner's columns kept, plus processing status
os.makedirs(DOCS, exist_ok=True)
with open(os.path.join(DOCS, "IMAGE_INDEX.csv"), "w", newline="", encoding="utf-8-sig") as fh:
    w = csv.writer(fh)
    w.writerow(["product_id", "owner_group_folder", "owner_file", "owner_original_filename", "role", "sort_order", "owner_category",
                "owner_label_UNVERIFIED", "orig_px", "md5", "site_status", "hold_reason", "edits", "flag", "gallery_file", "card_file", "thumb_file"])
    for g in groups.values():
        for i in g["images"]:
            v = i["variants"]
            w.writerow([g["id"], g["folder"], i["file"], i["ownerFilename"], i["role"], i["sort"], g["ownerType"], g["ownerLabel"],
                        f'{i["origWidth"]}x{i["origHeight"]}', i["md5"], g["status"], g["holdReason"] or "", "; ".join(i["edits"]), i["flag"],
                        v["gallery"]["src"], v["card"]["src"], v["thumb"]["src"]])

# Contact sheets: original (top) vs refined card (bottom) for every image
def sheets(items, name, cols=8, W=200, H=250):
    rows = (len(items) + cols - 1) // cols
    S = Image.new("RGB", (W * cols, (H * 2 + 20) * rows), "white"); d = ImageDraw.Draw(S)
    for n, (label, op, rp, held) in enumerate(items):
        x, y = (n % cols) * W, (n // cols) * (H * 2 + 20)
        d.text((x + 3, y + 2), label + (" HOLD" if held else ""), fill=(180, 0, 0) if held else "black")
        a = ImageOps.exif_transpose(Image.open(op)).convert("RGB"); a.thumbnail((W - 6, H - 6)); S.paste(a, (x + 3, y + 14))
        b = Image.open(rp).convert("RGB"); b.thumbnail((W - 6, H - 6)); S.paste(b, (x + 3, y + 14 + H))
    os.makedirs(os.path.join(DOCS, "contact-sheets"), exist_ok=True)
    S.save(os.path.join(DOCS, "contact-sheets", name), quality=88)
items = []
for g in groups.values():
    for i in g["images"]:
        items.append((i["stem"], os.path.join(SRC, "By_Product", g["folder"], i["file"]), os.path.join(PKG, g["id"], i["stem"] + "-card.jpg"), g["status"] not in ("integrated",)))
sheets(items[:24], "contact_1_KR-001-006_before-after.jpg"); sheets(items[24:], "contact_2_KR-007-STORE_before-after.jpg")
print("groups", len(groups), "integrated", sum(g["status"] == "integrated" for g in groups.values()),
      "images", len(items), "public files", sum(len(f) for _, _, f in os.walk(PUB)))
