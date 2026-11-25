#!/usr/bin/env python3
"""Blur the serial number, purchase date and hang-tag barcodes visible in the KR-001 watch photos.

Why: the warranty card shows a legible serial number and purchase date. Publishing them can be misused
(e.g. to pass off another watch), so they are blurred before the photos go on the public site.
Originals in assets-original/ are never modified. Only the derived web copies are changed:
  public/images/catalog/KR-001/*.jpg  and  image-package/refined/KR-001/*.jpg|webp

Run AFTER `npm run images:products` (which regenerates the unblurred copies):
    python3 scripts/redact-watch-papers.py
Regions are in gallery-image coordinates (450 x 800); card and thumb are mapped from them.
Needs Pillow only.
"""
import glob, os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G_W, G_H = 450, 800
RADIUS = 9  # gaussian radius at gallery scale; text there is ~14 px tall, so it becomes unreadable

# polygons per photo stem (gallery coordinates)
REGIONS = {
    "KR-001_01_main": [
        [(230, 140), (340, 150), (430, 225), (420, 345), (365, 355), (300, 330), (195, 270), (190, 225)],  # card text + date tag
        [(0, 535), (40, 535), (40, 605), (0, 605)],  # hang-tag barcode
        [(0, 595), (75, 595), (75, 665), (0, 665)],
    ],
    "KR-001_02_detail": [
        [(215, 255), (340, 255), (340, 335), (215, 335)],
        [(245, 495), (315, 495), (315, 545), (245, 545)],
    ],
    "KR-001_03_detail": [
        [(295, 255), (430, 255), (430, 335), (295, 335)],
        [(285, 550), (355, 550), (355, 605), (285, 605)],
    ],
    "KR-001_04_detail": [
        [(305, 125), (400, 155), (450, 235), (450, 350), (395, 352), (250, 235), (250, 185), (290, 150)],
        [(0, 550), (80, 550), (80, 640), (0, 640)],
    ],
    "KR-001_05_detail": [
        [(145, 170), (268, 170), (268, 258), (145, 258)],
    ],
    "KR-001_06_detail": [
        [(345, 280), (450, 280), (450, 335), (345, 335)],
        [(385, 330), (450, 330), (450, 385), (385, 385)],
        [(245, 548), (350, 548), (350, 650), (245, 650)],
    ],
}

def mapping(kind, size):
    """Return (scale, dx, dy) mapping gallery coordinates to the variant."""
    w, h = size
    if kind == "gallery":
        s = w / G_W
        return s, 0.0, 0.0
    s = max(w / G_W, h / G_H)  # `cover` crop, centred (focus 0.5, 0.5)
    return s, -(G_W * s - w) / 2, -(G_H * s - h) / 2

def redact(path):
    stem = os.path.basename(path).rsplit("-", 1)[0]
    kind = os.path.basename(path).rsplit("-", 1)[1].split(".")[0]
    if stem not in REGIONS:
        return False
    im = Image.open(path).convert("RGB")
    s, dx, dy = mapping(kind, im.size)
    mask = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(mask)
    for poly in REGIONS[stem]:
        d.polygon([(x * s + dx, y * s + dy) for x, y in poly], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(2 * s))
    blurred = im.filter(ImageFilter.GaussianBlur(RADIUS * s))
    out = Image.composite(blurred, im, mask)
    if path.endswith(".webp"):
        out.save(path, "WEBP", quality=84)
    else:
        out.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    return True

def main():
    n = 0
    for pat in ("public/images/catalog/KR-001/*.jpg", "image-package/refined/KR-001/*.jpg", "image-package/refined/webp/KR-001/*.webp"):
        for p in sorted(glob.glob(os.path.join(ROOT, pat))):
            n += redact(p)
    print(f"redacted {n} files")

if __name__ == "__main__":
    main()
