#!/usr/bin/env python3
"""Create a transparent-background version of the owner's original KAI RICHY logo.

Only the outer green wall/shadow behind the arch sign is removed. The sign itself (silver frame,
green panel, diamond, lettering) keeps its original pixels and colors. Edges are matted by color
unmixing (no hard cut, no green halo). The original JPEG is never modified:
  brand-assets/original/KAI-RICHY-logo-ORIGINAL.jpeg   (untouched backup)
Output: public/images/brand/kai-richy-logo.png  (RGBA)
Requires Pillow, numpy, scipy.
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "brand-assets", "original", "KAI-RICHY-logo-ORIGINAL.jpeg")
OUT = os.path.join(ROOT, "public", "images", "brand", "kai-richy-logo.png")

rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
H, W, _ = rgb.shape
R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]

# 1) Outer background = strongly green pixels connected to the image border.
greenish = ((G - R) > 9) & ((G - B) > 3) & ((G - R) / (G + 1) > 0.35)
lab, n = ndi.label(greenish)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, border[border > 0])
bg = ndi.binary_opening(bg, iterations=1) | bg  # keep as-is, opening only guards against specks
fg = ~bg
fg = ndi.binary_fill_holes(fg)          # interior green panel stays part of the logo
bg = ~fg

# 2) Local background / foreground colors by normalized convolution.
def local_color(mask, sigma):
    m = mask.astype(np.float32)
    num = np.stack([ndi.gaussian_filter(rgb[..., c] * m, sigma) for c in range(3)], -1)
    den = ndi.gaussian_filter(m, sigma)[..., None]
    return num / np.maximum(den, 1e-4)

bg_core = ndi.binary_erosion(bg, iterations=3)
fg_core = ndi.binary_erosion(fg, iterations=3)
Bc = local_color(bg_core, 6)
Fc = local_color(fg_core, 3)

# 3) Matte only in a thin band around the boundary.
band = ndi.binary_dilation(fg, iterations=3) & ndi.binary_dilation(bg, iterations=3)
d = Fc - Bc
num = ((rgb - Bc) * d).sum(-1)
den = (d * d).sum(-1)
alpha = np.where(den > 1.0, num / np.maximum(den, 1.0), 1.0)
alpha = np.clip(alpha, 0, 1)
A = np.where(band, alpha, np.where(fg, 1.0, 0.0)).astype(np.float32)

# 3b) Drop isolated dark specks left from the cast shadow right next to the boundary.
speck = (rgb.sum(-1) < 90) & (A > 0.08) & ndi.binary_dilation(A < 0.03, iterations=3)
A[speck] = 0

# 4) Remove background contamination from edge pixels.
a = np.maximum(A, 1e-3)[..., None]
clean = (rgb - (1 - A)[..., None] * Bc) / a
clean = np.clip(clean, 0, 255)
out_rgb = np.where(band[..., None] & (A[..., None] > 0.02), clean, rgb)
out_rgb = np.where(A[..., None] <= 0.02, Fc, out_rgb)  # fully transparent pixels: neutral color

rgba = np.dstack([out_rgb, A * 255]).astype(np.uint8)
im = Image.fromarray(rgba, "RGBA")
bbox = Image.fromarray((A * 255).astype(np.uint8)).point(lambda v: 255 if v > 8 else 0).getbbox()
pad = 6
bbox = (max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, W), min(bbox[3] + pad, H))
im = im.crop(bbox)
im.save(OUT, optimize=True)
print("saved", OUT, im.size, "crop box", bbox, "opaque share %.1f%%" % (100 * (A > 0.5).mean()))
