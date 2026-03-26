#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "用法: ./scripts/release.sh 4.0.2"
    exit 1
fi

VERSION="$1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cat > "$ROOT_DIR/version.json" <<EOF
{
    "version": "$VERSION",
    "updated": true
}
EOF

echo "✅ version.json 已更新为 $VERSION"
echo "下一步：提交并推送到 main，GitHub Actions 会自动创建 tag 和 Release。"
