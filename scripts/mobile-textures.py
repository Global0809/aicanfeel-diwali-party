"""Prepare phone JPEG variants without changing the authored red scene assets.

Run with the project's bundled Python/Pillow. The manifest keys are the virtual
URLs in fr.main; sourceUrl records the native loader's lodTarget-resolved JPEG.
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
        face_detail = "fbx-ape-lores_obsidian" in virtual_url.lower()
        maximum = 1024 if kind in {"skybox", "color", "lighting"} or face_detail else 512
        # Keep the broad shirt normal pattern legible as the camera approaches.
        if "Model_B2_Shirt_Normal" in virtual_url:
            maximum = 1024
        destination = output_root / source_relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as image:
            original_dimensions = image.size
            image = image.convert("RGB")
            image.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
            dimensions = image.size
            image.save(destination, "JPEG", quality=85, optimize=True, progressive=True,
                       subsampling=0 if kind == "normal" else 2)
        # Tiny authored maps can already be more efficient; retain their exact
        # original JPEG bytes when recompression would only increase transfer.
        copied = False
        if dimensions == original_dimensions and destination.stat().st_size >= source.stat().st_size:
            shutil.copyfile(source, destination)
            copied = True
        with Image.open(destination) as check:
            check.verify()
        entries[virtual_url] = {
            "url": "/mobile-textures/" + source_relative.as_posix(),
            "sourceUrl": "/" + source_relative.as_posix(),
            "kind": kind,
            "sourceBytes": source.stat().st_size,
            "bytes": destination.stat().st_size,
            "sourceDimensions": list(original_dimensions),
            "dimensions": list(dimensions),
            "quality": "original" if copied else 85,
        }
    if not entries:
        raise ValueError("No native red-scene texture declarations matched")
    source_bytes = sum(entry["sourceBytes"] for entry in entries.values())
    generated_bytes = sum(entry["bytes"] for entry in entries.values())
    manifest = {
        "schema": 1,
        "description": "Phone-only JPEG variants for the retained HAPE red gorilla and red environment. Original assets are unchanged.",
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
    temporary.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    temporary.replace(manifest_path)
    return manifest


if __name__ == "__main__":
    result = prepare(Path(__file__).resolve().parents[1])
    print(json.dumps(result["totals"], indent=2))
