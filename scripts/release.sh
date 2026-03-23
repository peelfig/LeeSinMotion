#!/bin/bash

# LeeSinMotion 快速发布脚本
# 使用方法: ./release.sh 4.0.1 "更新说明"

set -e

if [ -z "$1" ]; then
    echo "❌ 错误: 请提供版本号"
    echo "使用方法: ./release.sh 4.0.1 \"更新说明\""
    exit 1
fi

VERSION=$1
MESSAGE=${2:-"Release version $VERSION"}

echo "📦 准备发布版本 $VERSION"
echo ""

# 检查是否在 main 分支
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "⚠️  当前在 $BRANCH 分支"
    read -p "是否切换到 main 分支? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        git pull origin main
    else
        echo "❌ 取消发布"
        exit 1
    fi
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  有未提交的更改"
    git status --short
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 取消发布"
        exit 1
    fi
fi

# 更新版本号
echo "📝 更新版本号到 $VERSION"
cat > version.json <<EOF
{
    "version": "$VERSION",
    "updated": true
}
EOF

# 更新客户端版本号
echo "📝 更新客户端版本号"
sed -i '' "s/const currentVer = \"[^\"]*\"/const currentVer = \"$VERSION\"/" extension/client/index.html

# 提交更改
echo "💾 提交更改"
git add version.json extension/client/index.html
git commit -m "chore: bump version to $VERSION

$MESSAGE

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# 推送到远端
echo "🚀 推送到 GitHub"
git push origin main

echo ""
echo "✅ 版本 $VERSION 已推送到 main 分支"
echo "🤖 GitHub Actions 将自动创建 Release"
echo "🔗 查看进度: https://github.com/peelfig/LeeSinMotion/actions"
echo ""
