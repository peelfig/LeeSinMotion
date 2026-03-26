#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-main}"
VERSION=$(python3 -c "import json, pathlib; print(json.loads(pathlib.Path('$ROOT_DIR/version.json').read_text())['version'])")

case "$TARGET" in
  main)
    BUNDLE_ID="com.bepeel.leesin.motion"
    MENU_NAME="LeeSinMotion"
    BUILD_DIR="$ROOT_DIR/build/main"
    ;;
  dev)
    BUNDLE_ID="com.bepeel.leesin.motion.dev"
    MENU_NAME="LeeSinMotion (Dev)"
    BUILD_DIR="$ROOT_DIR/build/dev"
    ;;
  *)
    echo "Usage: ./scripts/build_extension.sh [main|dev]" >&2
    exit 1
    ;;
esac

STAGE_DIR="$BUILD_DIR/$BUNDLE_ID"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
cp -R "$ROOT_DIR/extension" "$STAGE_DIR"
rm -f "$STAGE_DIR/.debug"
rm -f "$STAGE_DIR/package-lock.json"

python3 - "$STAGE_DIR" "$BUNDLE_ID" "$MENU_NAME" "$VERSION" <<'PY'
import pathlib
import re
import sys

stage_dir = pathlib.Path(sys.argv[1])
bundle_id = sys.argv[2]
menu_name = sys.argv[3]
version = sys.argv[4]

manifest_path = stage_dir / 'CSXS' / 'manifest.xml'
manifest = manifest_path.read_text()
manifest = re.sub(r'ExtensionBundleId="[^"]+"', f'ExtensionBundleId="{bundle_id}"', manifest)
manifest = re.sub(r'ExtensionBundleVersion="[^"]+"', f'ExtensionBundleVersion="{version}"', manifest)
manifest = re.sub(r'<Extension Id="[^"]+" Version="[^"]+" />', f'<Extension Id="{bundle_id}" Version="{version}" />', manifest, count=1)
manifest = re.sub(r'<Extension Id="[^"]+">', f'<Extension Id="{bundle_id}">', manifest, count=1)
manifest = re.sub(r'<Menu>[^<]+</Menu>', f'<Menu>{menu_name}</Menu>', manifest)
manifest_path.write_text(manifest)

client_path = stage_dir / 'client' / 'index.html'
client = client_path.read_text()
client = re.sub(r'const currentVer = "[^"]+";', f'const currentVer = "{version}";', client)
client_path.write_text(client)

package_json_path = stage_dir / 'package.json'
if package_json_path.exists():
    package_json = package_json_path.read_text()
    package_json = re.sub(r'"version":\s*"[^"]+"', f'"version": "{version}"', package_json, count=1)
    package_json_path.write_text(package_json)
PY

echo "$STAGE_DIR"
