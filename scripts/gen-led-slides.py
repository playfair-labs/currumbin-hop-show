#!/usr/bin/env python3
"""Generate SAMPLE-stamped Curt LED slides for the HOP SHOW sell-pack."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SPONSORS = ROOT / "assets" / "sponsors"
CYCLE = ROOT / "assets" / "cycle"

W, H = 1920, 1080
FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / name
    if path.exists():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


BOLD = "DejaVuSans-Bold.ttf"
REG = "DejaVuSans.ttf"


def hex_rgb(c: str) -> tuple[int, int, int]:
    c = c.lstrip("#")
    return int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)


def rounded(draw: ImageDraw.ImageDraw, box, fill, radius=18):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def slide(path: Path, *, bg, accent, zone, package, title, sub, footer):
    img = Image.new("RGB", (W, H), hex_rgb(bg))
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 28, H), fill=hex_rgb(accent))
    d.rectangle((0, 0, W, 88), fill=(8, 10, 14))
    d.rectangle((0, H - 88, W, H), fill=(8, 10, 14))

    d.text((56, 28), "HOP SHOW  ·  CURRUMBIN  ·  SAMPLE LED", font=font(BOLD, 28), fill=(230, 236, 240))
    stamp = "SAMPLE — NOT A LIVE PITCH"
    tw = d.textlength(stamp, font=font(BOLD, 22))
    rounded(d, (W - tw - 72, 22, W - 36, 66), (180, 32, 48), 20)
    d.text((W - tw - 54, 30), stamp, font=font(BOLD, 22), fill=(255, 255, 255))

    pills = [zone, package, "SAMPLE"]
    x = 56
    for pill in pills:
        pw = d.textlength(pill, font=font(BOLD, 22)) + 36
        rounded(d, (x, 116, x + pw, 162), (20, 24, 30), 20)
        d.text((x + 18, 124), pill, font=font(BOLD, 22), fill=(232, 236, 239))
        x += pw + 14

    d.text((56, 430), title, font=font(BOLD, 92), fill=(255, 255, 255))
    d.text((56, 560), sub, font=font(REG, 36), fill=(210, 216, 222))
    d.text((56, H - 62), footer, font=font(REG, 24), fill=(160, 168, 176))
    d.text((W - 420, H - 62), "SAMPLE ONLY", font=font(BOLD, 24), fill=hex_rgb(accent))

    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


def main() -> None:
    slide(
        SPONSORS / "WALL_L.png",
        bg="#2a1248",
        accent="#b57bff",
        zone="WALL_L",
        package="PKG_SPOT_SINGLE",
        title="SPOT  [SAMPLE]",
        sub="One 3×2 m Curt LED  ·  timed wall insert  ·  SAMPLE",
        footer="HOP SHOW · Currumbin · WALL_L · 3×2 m",
    )
    slide(
        SPONSORS / "WALL_R.png",
        bg="#2a1608",
        accent="#f2a24a",
        zone="WALL_R",
        package="PKG_BALTER_SAMPLE",
        title="BALTER  [SAMPLE]",
        sub="One 3×2 m Curt LED  ·  local sample  ·  not a live hold",
        footer="HOP SHOW · Currumbin · WALL_R · 3×2 m",
    )
    slide(
        SPONSORS / "WALL_BACK.png",
        bg="#10141c",
        accent="#e8d24a",
        zone="WALL_BACK",
        package="PKG_TITLE_WRAP",
        title="TITLE WRAP  [SAMPLE]",
        sub="5 m back Curt LED  ·  end bank  ·  SAMPLE package",
        footer="HOP SHOW · Currumbin · WALL_BACK · 5 m",
    )
    slide(
        CYCLE / "cycle_SPOT_SINGLE.png",
        bg="#1a1030",
        accent="#c8f542",
        zone="CYCLE",
        package="PKG_SPOT_SINGLE",
        title="SPOT SINGLE",
        sub="SAMPLE cycle card  ·  not a live rate",
        footer="HOP SHOW · Currumbin · cycle_SPOT_SINGLE",
    )
    slide(
        CYCLE / "cycle_BALTER_SAMPLE.png",
        bg="#1a1208",
        accent="#f2a24a",
        zone="CYCLE",
        package="PKG_BALTER_SAMPLE",
        title="BALTER SAMPLE",
        sub="SAMPLE cycle card  ·  beer option gated  ·  not locked",
        footer="HOP SHOW · Currumbin · cycle_BALTER_SAMPLE",
    )
    slide(
        CYCLE / "cycle_WALL_TAKEOVER.png",
        bg="#0c1424",
        accent="#4ad2e8",
        zone="CYCLE",
        package="PKG_WALL_TAKEOVER",
        title="WALL TAKEOVER",
        sub="SAMPLE cycle card  ·  full bank one night  ·  not live",
        footer="HOP SHOW · Currumbin · cycle_WALL_TAKEOVER",
    )


if __name__ == "__main__":
    main()
