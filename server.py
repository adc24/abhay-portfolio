#!/usr/bin/env python3
"""Small zero-dependency development server for the portfolio."""

from __future__ import annotations

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
HOST = os.environ.get("HOST", "0.0.0.0")

try:
    PORT = int(os.environ.get("PORT", "4173"))
except ValueError as error:
    raise SystemExit("PORT must be a valid integer.") from error


class PortfolioRequestHandler(SimpleHTTPRequestHandler):
    """Serve static files with useful local-development headers."""

    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".webmanifest": "application/manifest+json; charset=utf-8",
        ".pdf": "application/pdf",
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()


class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True


def main() -> None:
    handler = partial(PortfolioRequestHandler, directory=str(PROJECT_ROOT))
    server = ReusableThreadingHTTPServer((HOST, PORT), handler)

    print("\nAbhay Chouhan Portfolio")
    print(f"Project: {PROJECT_ROOT}")
    print(f"Local:   http://localhost:{PORT}")
    print("Stop:    Ctrl + C\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping portfolio server…")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
