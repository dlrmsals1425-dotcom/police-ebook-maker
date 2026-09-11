# -*- coding: utf-8 -*-
"""Create PWA PNG icons from a simple drawn badge."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "icons"


def write_png(path, size, rgba_fn):
    import struct
    import zlib

    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            r, g, b, a = rgba_fn(x, y, size)
            raw.extend((r, g, b, a))

    def chunk(tag, data):
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    path.write_bytes(png)


def color(x, y, size):
    # navy rounded square + gold inset + white 112-like bars
    nx = x / (size - 1)
    ny = y / (size - 1)
    # rounded rect mask
    rad = 0.18
    px, py = nx * 2 - 1, ny * 2 - 1
    ax, ay = abs(px), abs(py)
    # approximate rounded square
    m = 0.92
    if ax > m - rad and ay > m - rad:
        dx, dy = ax - (m - rad), ay - (m - rad)
        inside = (dx * dx + dy * dy) <= rad * rad
    else:
        inside = ax <= m and ay <= m
    if not inside:
        return (0, 0, 0, 0)

    # gold ring
    inner = 0.78
    if ax > inner - rad and ay > inner - rad:
        dx, dy = ax - (inner - rad), ay - (inner - rad)
        in2 = (dx * dx + dy * dy) <= (rad * 0.7) ** 2
    else:
        in2 = ax <= inner and ay <= inner
    if not in2:
        return (224, 177, 58, 255)

    # navy fill
    r, g, b = 10, 37, 64

    # shield-ish trapezoid
    if 0.22 < ny < 0.78 and abs(nx - 0.5) < 0.28 - (ny - 0.22) * 0.08:
        r, g, b = 29, 91, 184

    # simple "112" as three blocks
    def bar(x0, x1, y0, y1):
        return x0 < nx < x1 and y0 < ny < y1

    white = False
    # 1
    if bar(0.28, 0.36, 0.38, 0.68):
        white = True
    # 1
    if bar(0.42, 0.50, 0.38, 0.68):
        white = True
    # 2-ish
    if bar(0.56, 0.74, 0.38, 0.46) or bar(0.66, 0.74, 0.46, 0.53) or bar(0.56, 0.74, 0.53, 0.61) or bar(0.56, 0.64, 0.61, 0.68) or bar(0.56, 0.74, 0.68, 0.76):
        white = True
    if white:
        return (255, 255, 255, 255)
    return (r, g, b, 255)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    write_png(OUT / "icon-192.png", 192, color)
    write_png(OUT / "icon-512.png", 512, color)
    print("wrote", OUT / "icon-192.png")
    print("wrote", OUT / "icon-512.png")


if __name__ == "__main__":
    main()
