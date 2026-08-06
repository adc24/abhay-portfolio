#!/usr/bin/env python3
"""Render the portfolio résumé PDF into browser-safe PNG preview pages."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Set

try:
    import fitz  # PyMuPDF
except ImportError as error:
    raise SystemExit(
        "PyMuPDF is required. Run: python -m pip install -r requirements-dev.txt"
    ) from error

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = PROJECT_ROOT / "assets"
PDF_PATH = ASSETS_DIR / "Abhay_Chouhan_Resume.pdf"
SCALE = 2


def main() -> None:
    if not PDF_PATH.is_file():
        raise SystemExit(f"Résumé PDF not found: {PDF_PATH}")

    document = fitz.open(PDF_PATH)
    expected_outputs: Set[Path] = set()

    try:
        for page_number, page in enumerate(document, start=1):
            output_path = ASSETS_DIR / f"resume-page-{page_number}.png"
            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(SCALE, SCALE),
                alpha=False,
            )
            pixmap.save(output_path)
            expected_outputs.add(output_path)
            print(
                f"Rendered page {page_number}: {output_path.name} "
                f"({pixmap.width}×{pixmap.height})"
            )
    finally:
        document.close()

    for old_preview in ASSETS_DIR.glob("resume-page-*.png"):
        if old_preview not in expected_outputs:
            old_preview.unlink()
            print(f"Removed stale preview: {old_preview.name}")

    print(f"Done — generated {len(expected_outputs)} résumé preview page(s).")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # Give CLI users a concise error message.
        print(f"Error: {error}", file=sys.stderr)
        raise
