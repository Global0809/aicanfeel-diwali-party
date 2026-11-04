"""Prepare higher-fidelity phone JPEGs without changing authored scene assets.

Run with the project's bundled Python/Pillow. The manifest keys are the virtual
URLs in fr.main; sourceUrl records the native loader's lodTarget-resolved JPEG.
Character color/normal maps retain authored detail up to 2K. New HQ URLs leave
older phone variants intact for existing cached deployments.
"""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path, PurePosixPath

from PIL import Image


def texture_kind(url: str) -> str:
    lower = url.lower()
    if "skybox" in lower:
        return "skybox"
    if "normal" in lower:
        return "normal"
    if "roughness" in lower or "metallic" in lower:
        return "material"
    if "_ao" in lower:
        return "occlusion"
    if "lightred" in lower:
        return "lighting"
    return "color"


def prepare(project_root: Path) -> dict:
    project_root = project_root.resolve()
    dist = project_root / "dist"
    output_root = dist / "mobile-textures"
    asset_root = output_root / "hq"
    output_root.mkdir(parents=True, exist_ok=True)
    native = (project_root / "vendor/reference-runtime.js").read_text(encoding="utf-8")
    pattern = re.compile(
        r'\{url:"(?P<url>/textures/Hape_0003/[^"]+|/glxp/environment/(?:SkyboxRed|LightRed3)\.jpg)",'
        r'options:\[(?P<options>[^\]]*)\]\}'
    )
    entries = {}
    for match in pattern.finditer(native):
        virtual_url = match.group("url")
        if virtual_url in entries:
            raise ValueError(f"Duplicate native texture URL: {virtual_url}")
        options = re.findall(r'"([^"]+)"', match.group("options"))
        lod = next((item.split("=", 1)[1] for item in options if item.startswith("lodTarget=")), None)
        virtual_path = PurePosixPath(virtual_url.lstrip("/"))
        source_relative = (
            virtual_path.parent / lod / (virtual_path.name + (".png" if "transparent" in options else ".jpg"))
            if lod else virtual_path
        )
        source = dist / source_relative
        # KTX2 files remain intact and are not decoded/re-encoded by this tool.
        if source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        if not source.is_file():
            raise FileNotFoundError(f"Native JPEG source is missing: {source}")
        kind = texture_kind(virtual_url)
        character_detail = virtual_url.startswith("/textures/Hape_0003/") and kind in {"color", "normal"}
        face_detail = "fbx-ape-lores_obsidian" in virtual_url.lower()
        maximum = 1024 if kind in {"skybox", "color", "lighting"} or character_detail else 512
        # The opening camera is an extreme close-up. Retain the original face
        # maps and the shirt's fine normal pattern at their authored 2K size.
        if character_detail and (face_detail or "Model_B2_Shirt_Normal" in virtual_url):
            maximum = 2048
        quality = 94 if character_detail else 85
        destination = asset_root / source_relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as image:
            original_dimensions = image.size
            image = image.convert("RGB")
            image.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
            dimensions = image.size
            image.save(destination, "JPEG", quality=quality, optimize=True, progressive=True,
                       subsampling=0 if character_detail or kind == "normal" else 2)
        # Unresized character maps are copied byte-for-byte. Re-encoding an
        # original JPEG cannot add detail and would introduce another loss.
        # Also retain tiny source maps when recompression would increase size.
        copied = False
        if dimensions == original_dimensions and (character_detail or destination.stat().st_size >= source.stat().st_size):
            shutil.copyfile(source, destination)
            copied = True
        with Image.open(destination) as check:
            check.verify()
        entries[virtual_url] = {
            "url": "/mobile-textures/hq/" + source_relative.as_posix(),
            "sourceUrl": "/" + source_relative.as_posix(),
            "kind": kind,
            "sourceBytes": source.stat().st_size,
            "bytes": destination.stat().st_size,
            "sourceDimensions": list(original_dimensions),
            "dimensions": list(dimensions),
            "quality": "original" if copied else quality,
        }
    if not entries:
        raise ValueError("No native red-scene texture declarations matched")
    source_bytes = sum(entry["sourceBytes"] for entry in entries.values())
    generated_bytes = sum(entry["bytes"] for entry in entries.values())
    manifest = {
        "schema": 1,
        "description": "Higher-fidelity phone JPEG profile: authored character color/normal maps up to 2K, with compact environment and shading maps. Original assets and earlier phone variants are unchanged.",
        "profile": "mobile-hq",
        "entries": entries,
        "totals": {
            "entryCount": len(entries),
            "sourceJpegBytes": source_bytes,
            "generatedJpegBytes": generated_bytes,
            "savedBytes": source_bytes - generated_bytes,
            "reductionPercent": round((1 - generated_bytes / source_bytes) * 100, 2),
            "sourcePixels": sum(entry["sourceDimensions"][0] * entry["sourceDimensions"][1] for entry in entries.values()),
            "generatedPixels": sum(entry["dimensions"][0] * entry["dimensions"][1] for entry in entries.values()),
        },
    }
    manifest_path = output_root / "manifest.json"
    temporary = manifest_path.with_suffix(".json.tmp")
    temporary.write_bytes((json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))
    temporary.replace(manifest_path)
    return manifest


if __name__ == "__main__":
    result = prepare(Path(__file__).resolve().parents[1])
    print(json.dumps(result["totals"], indent=2))
