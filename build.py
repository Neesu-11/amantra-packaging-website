"""Asset optimisation for the Amantra Packaging static site.

Converts source photography to responsive WebP and re-encodes the hero video.
Run from the project root:

    python build.py            # generate assets, leave sources in place
    python build.py --prune    # generate assets, then delete the sources
    python build.py --force    # rebuild even if outputs look up to date

Outputs land next to their sources and are committed. Nothing here runs on
Vercel; the deployed site is plain static files.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent.resolve()
MANIFEST_PATH = ROOT / "asset-manifest.json"
HERO_STATE_KEY = "_hero"

SOURCE_SUFFIXES = {".png", ".jpg", ".jpeg"}
WEBP_QUALITY = 82


@dataclass(frozen=True)
class ImageSet:
    """A directory of images and the rendered widths it needs."""

    directory: Path
    widths: tuple[int, ...]
    # Why these widths: see the CSS rules noted per entry in IMAGE_SETS.


IMAGE_SETS = (
    # .our-portfolio-logo .portfolio-card-img is height:220px / object-fit:contain
    # inside a carousel, so cards render around 300-400 CSS px wide.
    ImageSet(ROOT / "media" / "portfolio", (400, 800)),
    # .services-sec .bottom-box is a min-height:400px two-column grid cell and the
    # markup already declares 600x400.
    ImageSet(ROOT / "media" / "services", (600, 1200)),
)

HERO_SOURCE = ROOT / "media" / "hero-background.mp4"
HERO_OUTPUT = ROOT / "media" / "hero-background.mp4"
HERO_POSTER = ROOT / "media" / "hero-poster.webp"
HERO_MAX_WIDTH = 1280
HERO_CRF = 30

# Social scrapers (WhatsApp in particular) are unreliable with WebP, so the share
# card is a JPEG cropped to the 1.91:1 ratio Facebook and LinkedIn expect.
OG_IMAGE = ROOT / "images" / "og-image.jpg"
OG_SIZE = (1200, 630)
# 00:00:01 lands mid-crossfade and comes out ghosted; 2.5s is a clean press shot.
HERO_POSTER_TIMESTAMP = "00:00:02.5"


def human(num_bytes: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if abs(num_bytes) < 1024:
            return f"{num_bytes:.1f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def variant_path(source: Path, width: int) -> Path:
    return source.with_name(f"{source.stem}-{width}w.webp")


def is_stale(source: Path, outputs: list[Path]) -> bool:
    if not all(out.exists() for out in outputs):
        return True
    newest_source = source.stat().st_mtime
    return any(out.stat().st_mtime < newest_source for out in outputs)


def convert_image(source: Path, widths: tuple[int, ...]) -> dict:
    """Write one WebP per width, preserving aspect ratio. Never upscales."""
    with Image.open(source) as img:
        img = img.convert("RGBA") if img.mode in ("P", "LA", "RGBA") else img.convert("RGB")
        original_width, original_height = img.size

        variants = []
        for width in widths:
            target_width = min(width, original_width)
            target_height = max(1, round(original_height * target_width / original_width))
            resized = img.resize((target_width, target_height), Image.LANCZOS)
            out_path = variant_path(source, width)
            resized.save(
                out_path,
                "WEBP",
                quality=WEBP_QUALITY,
                method=6,
            )
            variants.append(
                {
                    "width": target_width,
                    "height": target_height,
                    "path": "/" + out_path.relative_to(ROOT).as_posix(),
                    "bytes": out_path.stat().st_size,
                }
            )

    return {
        "source": "/" + source.relative_to(ROOT).as_posix(),
        "sourceBytes": source.stat().st_size,
        "originalWidth": original_width,
        "originalHeight": original_height,
        "variants": variants,
    }


def process_images(force: bool) -> tuple[dict, int, int]:
    manifest: dict = {}
    bytes_in = 0
    bytes_out = 0

    for image_set in IMAGE_SETS:
        if not image_set.directory.exists():
            print(f"  skip (missing): {image_set.directory.relative_to(ROOT)}")
            continue

        sources = sorted(
            p
            for p in image_set.directory.iterdir()
            if p.suffix.lower() in SOURCE_SUFFIXES and p.is_file()
        )

        for source in sources:
            outputs = [variant_path(source, w) for w in image_set.widths]
            if not force and not is_stale(source, outputs):
                entry = manifest_entry_from_disk(source, image_set.widths)
                manifest[entry["source"]] = entry
                print(f"  up to date: {source.name}")
                continue

            entry = convert_image(source, image_set.widths)
            manifest[entry["source"]] = entry

            saved = entry["sourceBytes"] - sum(v["bytes"] for v in entry["variants"])
            bytes_in += entry["sourceBytes"]
            bytes_out += sum(v["bytes"] for v in entry["variants"])
            print(
                f"  {source.name}: {human(entry['sourceBytes'])} -> "
                f"{human(sum(v['bytes'] for v in entry['variants']))} "
                f"(saved {human(saved)})"
            )

    return manifest, bytes_in, bytes_out


def manifest_entry_from_disk(source: Path, widths: tuple[int, ...]) -> dict:
    with Image.open(source) as img:
        original_width, original_height = img.size

    variants = []
    for width in widths:
        out_path = variant_path(source, width)
        with Image.open(out_path) as variant:
            variant_width, variant_height = variant.size
        variants.append(
            {
                "width": variant_width,
                "height": variant_height,
                "path": "/" + out_path.relative_to(ROOT).as_posix(),
                "bytes": out_path.stat().st_size,
            }
        )

    return {
        "source": "/" + source.relative_to(ROOT).as_posix(),
        "sourceBytes": source.stat().st_size,
        "originalWidth": original_width,
        "originalHeight": original_height,
        "variants": variants,
    }


def ffmpeg_exe() -> str:
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def run_ffmpeg(args: list[str]) -> None:
    result = subprocess.run(
        [ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y", *args],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed:\n{result.stderr.strip()}")


def process_hero(force: bool, state: dict) -> dict:
    """Re-encode the hero in place. Idempotent via the manifest.

    The output replaces its own input, so without the recorded marker a second
    run would re-compress already-compressed video and lose quality each time.
    """
    if not HERO_SOURCE.exists():
        print(f"  skip (missing): {HERO_SOURCE.name}")
        return state

    if state.get("optimized") and not force:
        print(f"  up to date: {HERO_SOURCE.name} (use --force to re-encode)")
    else:
        original_bytes = HERO_SOURCE.stat().st_size

        # The hero is muted and decorative, so drop audio entirely and cap the width.
        # faststart moves the index to the front so playback can begin while loading.
        temp_output = HERO_SOURCE.with_name("hero-background.tmp.mp4")
        run_ffmpeg(
            [
                "-i", str(HERO_SOURCE),
                "-vf", f"scale='min({HERO_MAX_WIDTH},iw)':-2",
                "-c:v", "libx264",
                "-crf", str(HERO_CRF),
                "-preset", "slow",
                "-profile:v", "high",
                "-pix_fmt", "yuv420p",
                "-an",
                "-movflags", "+faststart",
                str(temp_output),
            ]
        )

        new_bytes = temp_output.stat().st_size
        if new_bytes >= original_bytes:
            print(f"  hero re-encode was not smaller ({human(new_bytes)}); keeping original")
            temp_output.unlink()
        else:
            shutil.move(str(temp_output), str(HERO_OUTPUT))
            print(
                f"  hero-background.mp4: {human(original_bytes)} -> {human(new_bytes)} "
                f"(saved {human(original_bytes - new_bytes)})"
            )

    if not HERO_POSTER.exists():
        temp_frame = HERO_SOURCE.with_name("hero-poster.tmp.png")
        run_ffmpeg(
            [
                "-ss", HERO_POSTER_TIMESTAMP,
                "-i", str(HERO_OUTPUT),
                "-frames:v", "1",
                str(temp_frame),
            ]
        )
        with Image.open(temp_frame) as frame:
            frame = frame.convert("RGB")
            ratio = min(1.0, HERO_MAX_WIDTH / frame.width)
            if ratio < 1.0:
                frame = frame.resize(
                    (round(frame.width * ratio), round(frame.height * ratio)),
                    Image.LANCZOS,
                )
            frame.save(HERO_POSTER, "WEBP", quality=80, method=6)
        temp_frame.unlink()
        print(f"  hero-poster.webp: {human(HERO_POSTER.stat().st_size)}")

    return {
        "optimized": True,
        "bytes": HERO_OUTPUT.stat().st_size,
        "poster": "/" + HERO_POSTER.relative_to(ROOT).as_posix(),
    }


def build_og_image(force: bool) -> None:
    """Crop the hero poster to a social share card."""
    if not HERO_POSTER.exists():
        print("  skip (no hero poster yet)")
        return
    if OG_IMAGE.exists() and not force:
        print(f"  up to date: {OG_IMAGE.name}")
        return

    target_ratio = OG_SIZE[0] / OG_SIZE[1]
    with Image.open(HERO_POSTER) as poster:
        poster = poster.convert("RGB")
        width, height = poster.size
        if width / height > target_ratio:
            crop_width = round(height * target_ratio)
            left = (width - crop_width) // 2
            box = (left, 0, left + crop_width, height)
        else:
            crop_height = round(width / target_ratio)
            top = (height - crop_height) // 2
            box = (0, top, width, top + crop_height)
        poster.crop(box).resize(OG_SIZE, Image.LANCZOS).save(
            OG_IMAGE, "JPEG", quality=82, optimize=True, progressive=True
        )

    print(f"  {OG_IMAGE.name}: {human(OG_IMAGE.stat().st_size)}")


def prune_sources(manifest: dict) -> int:
    freed = 0
    for entry in manifest.values():
        source = ROOT / entry["source"].lstrip("/")
        if source.exists():
            freed += source.stat().st_size
            source.unlink()
            print(f"  pruned: {source.relative_to(ROOT)}")
    return freed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--prune",
        action="store_true",
        help="delete source images after successful conversion",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="rebuild outputs even when they appear up to date",
    )
    parser.add_argument(
        "--skip-video",
        action="store_true",
        help="skip hero video re-encoding",
    )
    args = parser.parse_args()

    existing = {}
    if MANIFEST_PATH.exists():
        existing = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    print("Images")
    manifest, bytes_in, bytes_out = process_images(force=args.force)

    hero_state = existing.get(HERO_STATE_KEY, {})
    if not args.skip_video:
        print("\nHero video")
        hero_state = process_hero(force=args.force, state=hero_state)

    print("\nSocial share card")
    build_og_image(force=args.force)

    # Merge rather than overwrite: once sources are pruned this run finds nothing,
    # and a plain write would discard the dimensions recorded for existing assets.
    combined = dict(existing)
    combined.update(manifest)
    if hero_state:
        combined[HERO_STATE_KEY] = hero_state
    MANIFEST_PATH.write_text(json.dumps(combined, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {MANIFEST_PATH.name} ({len(combined)} images)")

    if bytes_in:
        print(
            f"Images: {human(bytes_in)} -> {human(bytes_out)} "
            f"({100 * (1 - bytes_out / bytes_in):.1f}% smaller)"
        )

    if args.prune:
        print("\nPruning sources")
        freed = prune_sources(manifest)
        print(f"Freed {human(freed)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
