#!/bin/bash
# 版本号一致性检测脚本
# 检查 version.json、extension/client/index.html、extension/package.json 中的版本号是否一致

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "🔍 检查版本号一致性..."
echo ""

# 读取各个文件中的版本号
VERSION_JSON=$(python3 -c "import json, pathlib; print(json.loads(pathlib.Path('version.json').read_text())['version'])")
VERSION_HTML=$(grep -o 'const currentVer = "[^"]*"' extension/client/index.html | sed 's/const currentVer = "//;s/"//')
VERSION_PACKAGE=$(python3 -c "import json, pathlib; print(json.loads(pathlib.Path('extension/package.json').read_text())['version'])")
VERSION_MANIFEST=$(grep -o 'ExtensionBundleVersion="[^"]*"' extension/CSXS/manifest.xml | sed 's/ExtensionBundleVersion="//;s/"//')

echo "📄 version.json:              $VERSION_JSON"
echo "📄 extension/client/index.html: $VERSION_HTML"
echo "📄 extension/package.json:      $VERSION_PACKAGE"
echo "📄 extension/CSXS/manifest.xml: $VERSION_MANIFEST"
echo ""

# 检查是否一致
if [ "$VERSION_JSON" = "$VERSION_HTML" ] && [ "$VERSION_JSON" = "$VERSION_PACKAGE" ] && [ "$VERSION_JSON" = "$VERSION_MANIFEST" ]; then
    echo "✅ 所有版本号一致: v$VERSION_JSON"
    exit 0
else
    echo "❌ 版本号不一致！"
    echo ""
    echo "请运行以下命令同步版本号："
    echo "  ./scripts/release.sh $VERSION_JSON"
    exit 1
fi
