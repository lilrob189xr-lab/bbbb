#!/usr/bin/env python3
"""Prepare web copies of the owner's branch photos from assets-original/ (originals are never modified).

Careful, color-neutral enhancement only: EXIF orientation, light noise reduction, gentle exposure/contrast
correction on luminance only (chroma untouched, so metal and gemstone colors do not shift), light sharpening,
resize, JPEG export.
No retouching, cloning, filters or generated content.
Requires Pillow:  python3 scripts/enhance-photos.py
"""
import os
import numpy as np
import cv2
from PIL import Image, ImageOps, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDS = ["394AFAAD", "9314B702", "CEBE7D37", "4329AD16", "4FAB235C", "636A36E8", "84B55986", "D7C57040", "FEC832B8"]
SRC = os.path.join(ROOT, "assets-original", "03-BRANCH-AND-STORE-PHOTOS")
OUT = os.path.join(ROOT, "public", "images", "branches")
os.makedirs(OUT, exist_ok=True)

def find(i):
    for r, _, fs in os.walk(SRC):
        for f in fs:
            if f.startswith(i):
                return os.path.join(r, f)

def enhance(im):
    im = ImageOps.exif_transpose(im).convert("RGB")
    arr = cv2.fastNlMeansDenoisingColored(np.asarray(im), None, 3, 3, 5, 15)   # mild noise reduction
    im = Image.fromarray(arr)
    y, cb, cr = im.convert("YCbCr").split()
    y = ImageOps.autocontrast(y, cutoff=0.3)                                    # luminance only
    ya = np.asarray(y).astype(np.float32) / 255.0
    gamma = float(np.clip(np.log(0.47) / np.log(max(ya.mean(), 0.05)), 0.92, 1.06))  # gentle exposure nudge
    y = Image.fromarray((np.power(ya, gamma) * 255).astype(np.uint8))
    im = Image.merge("YCbCr", (y, cb, cr)).convert("RGB")
    im.thumbnail((1600, 1600), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=40, threshold=3)), gamma

for i in IDS:
    im, g = enhance(Image.open(find(i)))
    im.save(os.path.join(OUT, i + ".jpg"), quality=86, optimize=True, progressive=True)
    print(i, im.size, "gamma %.2f" % g)
