#!/bin/bash
# LeeSinMotion 物理同步脚本 (双版本独立)
# 用法: 
#   ./scripts/sync_to_cep.sh main  - 更新正式版
#   ./scripts/sync_to_cep.sh dev   - 更新开发版

set -e
cd "$(dirname "$0")/.."

TARGET=$1
CEP_DIR="/Library/Application Support/Adobe/CEP/extensions"

if [ "$TARGET" == "main" ]; then
    DEST="$CEP_DIR/com.bepeel.leesin.motion"
    ID="com.bepeel.leesin.motion"
    MENU="LeeSinMotion"
    COLOR="🔵 正式版"
elif [ "$TARGET" == "dev" ]; then
    DEST="$CEP_DIR/com.bepeel.leesin.motion.dev"
    ID="com.bepeel.leesin.motion.dev"
    MENU="LeeSinMotion (Dev)"
    COLOR="🟡 开发版"
else
    echo "❌ 错误: 请输入 [main] 或 [dev]"
    exit 1
fi

echo "📦 正在物理同步 $COLOR 到系统目录..."

# 1. 物理拷贝
sudo rm -rf "$DEST"
sudo mkdir -p "$DEST"
sudo cp -R extension/ "$DEST/"

# 2. 强行修正系统目录下的 manifest.xml (解决标题不对的问题)
# 这里的正则非常暴力，直接替换所有 ID 和菜单名
sudo sed -i '' "s/ExtensionBundleId=\"[^\"]*\"/ExtensionBundleId=\"$ID\"/" "$DEST/CSXS/manifest.xml"
sudo sed -i '' "s/Extension Id=\"[^\"]*\"/Extension Id=\"$ID\"/g" "$DEST/CSXS/manifest.xml"
sudo sed -i '' "s/<Menu>[^<]*<\/Menu>/<Menu>$MENU<\/Menu>/" "$DEST/CSXS/manifest.xml"

# 3. 修正权限 (确保 AE 可读)
sudo chown -R $(whoami):staff "$DEST"
sudo chmod -R 755 "$DEST"

# 4. 清理缓存
rm -rf ~/Library/Caches/CSXS/com.bepeel.leesin.motion*

echo "✅ $COLOR 同步完成！"
echo "🚀 路径: $DEST"
echo "请重启 AE 验证。"
