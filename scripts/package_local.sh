#!/bin/bash
# 本地打包脚本 - 完全模拟 GitHub Actions Release 流程
# 用法: ./scripts/package_local.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# 检查版本号一致性
echo "🔍 检查版本号一致性..."
if ! ./scripts/check_version.sh; then
    echo ""
    echo "❌ 版本号检查失败，请先修复版本号不一致的问题"
    exit 1
fi
echo ""

# 读取当前版本号
VERSION=$(python3 -c "import json, pathlib; print(json.loads(pathlib.Path('version.json').read_text())['version'])")

echo "📦 开始本地打包 LeeSinMotion v${VERSION}"
echo ""

# 1. 构建扩展
echo "🔨 步骤 1/4: 构建扩展..."
STAGE_DIR=$(./scripts/build_extension.sh main)
echo "   ✓ 构建完成: $STAGE_DIR"
echo ""

# 2. 准备 release 目录
echo "📁 步骤 2/4: 准备打包目录..."
rm -rf release
mkdir -p release
cp -R "$STAGE_DIR" release/
cp "docs/安装说明_Installation.txt" release/

# 移除多余文件（与 GitHub Actions 保持一致）
rm -rf release/extension
rm -rf release/.DS_Store

echo "   ✓ 打包内容:"
ls -la release/
echo ""

# 3. 创建 ZIP 压缩包
echo "📦 步骤 3/4: 创建 ZIP 压缩包..."
cd release
zip -r "../LeeSinMotion_v${VERSION}.zip" . -q
cd ..

echo "   ✓ 压缩包已创建: LeeSinMotion_v${VERSION}.zip"
echo ""

# 4. 验证打包内容
echo "🔍 步骤 4/4: 验证打包内容..."
echo "   压缩包内容:"
unzip -l "LeeSinMotion_v${VERSION}.zip" | head -20
echo ""

# 清理临时目录
rm -rf release

echo "✅ 打包完成！"
echo ""
echo "📦 输出文件: LeeSinMotion_v${VERSION}.zip"
echo "📍 位置: $ROOT_DIR/LeeSinMotion_v${VERSION}.zip"
echo ""
echo "💡 提示: 解压后检查内容是否正确，应该只包含："
echo "   - com.bepeel.leesin.motion/"
echo "   - 安装说明_Installation.txt"
