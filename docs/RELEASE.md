# 自动发布流程说明

## 📦 自动化发布流程

当你将代码合并到 `main` 分支时，GitHub Actions 会自动：

1. ✅ 读取 `version.json` 中的版本号
2. ✅ 检查该版本是否已发布
3. ✅ 自动打包插件文件为 ZIP
4. ✅ 创建 GitHub Release
5. ✅ 上传安装包到 Release

## 🔄 发布新版本的步骤

### 1. 在 dev 分支开发功能
```bash
git checkout dev
# 开发你的功能...
git add .
git commit -m "feat: 新功能描述"
git push origin dev
```

### 2. 更新版本号
编辑 `version.json`：
```json
{
    "version": "4.0.1",
    "updated": true
}
```

### 3. 合并到 main 分支
```bash
git checkout main
git merge dev
git push origin main
```

### 4. 自动发布
推送到 main 后，GitHub Actions 会自动：
- 创建标签 `v4.0.1`
- 打包 `LeeSinMotion_v4.0.1.zip`
- 发布到 GitHub Releases

## 🔔 用户自动更新

### 插件端检测
插件会自动检测新版本：
1. 启动时从 GitHub 获取 `version.json`
2. 对比本地版本号
3. 如有新版本，显示橙色圆点提示
4. 点击版本号跳转到下载页面

### 用户更新流程
1. 看到版本号显示 `● v4.0.1`（橙色圆点）
2. 点击版本号
3. 跳转到 GitHub Releases 页面
4. 下载最新的 ZIP 包
5. 解压覆盖原有文件
6. 重启 After Effects

## 📝 版本号规范

使用语义化版本号（Semantic Versioning）：

- **主版本号（Major）**: 不兼容的 API 修改
  - 例如：`4.0.0` → `5.0.0`

- **次版本号（Minor）**: 向下兼容的功能性新增
  - 例如：`4.0.0` → `4.1.0`

- **修订号（Patch）**: 向下兼容的问题修正
  - 例如：`4.0.0` → `4.0.1`

## 🚀 快速发布命令

创建一个快捷脚本 `release.sh`：

```bash
#!/bin/bash
# 使用方法: ./release.sh 4.0.1

VERSION=$1

# 更新版本号
echo "{\"version\": \"$VERSION\", \"updated\": true}" > version.json

# 提交并推送
git add version.json
git commit -m "chore: bump version to $VERSION"
git push origin main

echo "✅ 版本 $VERSION 已推送，GitHub Actions 将自动发布"
```

## ⚠️ 注意事项

1. **版本号不能重复** - 如果版本号已存在，不会重复发布
2. **确保测试通过** - 合并到 main 前确保功能已测试
3. **更新日志** - 在 Release 中手动补充详细的更新说明
4. **文档同步** - 重要更新记得更新 README.md

## 🔧 故障排查

### Actions 失败
- 检查 `.github/workflows/release.yml` 语法
- 查看 Actions 日志找到错误原因
- 确保 `version.json` 格式正确

### 版本检测不工作
- 确保 `version.json` 在 main 分支
- 检查网络连接（插件需要访问 GitHub）
- 清除浏览器缓存重新加载插件

### 下载链接失效
- 确保 Release 已成功创建
- 检查 ZIP 文件是否正确上传
- 验证 GitHub Token 权限
