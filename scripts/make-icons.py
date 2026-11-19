"""Génère les icônes PWA (PNG) : une courbe de rebond blanche sur fond sarcelle.
Usage : python3 scripts/make-icons.py"""
from PIL import Image, ImageDraw

TEAL = (0, 120, 111, 255)
AMBER = (255, 185, 0, 255)
WHITE = (255, 255, 255, 255)


def draw_icon(size: int, maskable: bool) -> Image.Image:
    s = 4  # sur-échantillonnage pour l'anticrénelage
    S = size * s
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable:
        d.rectangle([0, 0, S, S], fill=TEAL)
        inset = 0.2  # zone de sécurité maskable
    else:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=TEAL)
        inset = 0.14
    pad = S * inset
    w = S - 2 * pad
    lw = int(w * 0.11)
    # Courbe : descente puis remontée (le rebond), en segments.
    pts = []
    import math
    for i in range(41):
        t = i / 40
        x = pad + w * (0.05 + 0.75 * t)
        y = pad + w * (0.25 + 0.55 * math.sin(math.pi * min(t * 1.25, 1.0)) * (1 if t < 0.8 else 1))
        if t > 0.5:
            # remontée plus haute que le départ
            u = (t - 0.5) / 0.5
            y = pad + w * (0.80 - 0.72 * u)
        pts.append((x, y))
    d.line(pts, fill=WHITE, width=lw, joint="curve")
    r = lw / 2
    for (x, y) in (pts[0],):
        d.ellipse([x - r, y - r, x + r, y + r], fill=WHITE)
    # Pointe de flèche.
    ex, ey = pts[-1]
    a = w * 0.17
    d.polygon([(ex + a * 0.55, ey - a * 0.55), (ex - a * 0.45, ey - a * 0.25), (ex + a * 0.25, ey + a * 0.45)], fill=WHITE)
    # Point ambre : l'imprévu, au creux de la courbe.
    lowest = max(pts, key=lambda p: p[1])
    cr = lw * 0.95
    d.ellipse([lowest[0] - cr, lowest[1] - cr, lowest[0] + cr, lowest[1] + cr], fill=AMBER)
    return img.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    out = "public/icons/"
    import os
    os.makedirs(out, exist_ok=True)
    draw_icon(192, False).save(out + "icon-192.png", optimize=True)
    draw_icon(512, False).save(out + "icon-512.png", optimize=True)
    draw_icon(512, True).save(out + "icon-maskable-512.png", optimize=True)
    draw_icon(180, True).convert("RGB").save(out + "apple-touch-icon.png", optimize=True)
    draw_icon(48, False).save("public/favicon.png", optimize=True)
    print("ok")
