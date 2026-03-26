# 更新指南 / Update Guide

## 如何更新 LeeSinMotion

### 方法一：手动更新（推荐）

1. **下载最新版本**
   - 访问 [GitHub Releases](https://github.com/peelfig/LeeSinMotion/releases/latest)
   - 下载最新的 `LeeSinMotion_vX.X.X.zip`

2. **关闭 After Effects**
   - 确保 AE 完全关闭

3. **替换插件文件夹**
   - 解压下载的 ZIP 文件
   - 找到旧的插件目录：
     - **Mac**: `/Library/Application Support/Adobe/CEP/extensions/com.bepeel.leesin.motion`
     - **Windows**: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.bepeel.leesin.motion`
   - 删除旧文件夹
   - 复制新的 `com.bepeel.leesin.motion` 文件夹到该位置

4. **重启 After Effects**
   - 打开 AE，插件会自动加载新版本

### 方法二：全新安装

如果遇到问题，可以完全卸载后重新安装：

1. 删除旧插件文件夹（路径见上方）
2. 清理缓存：
   - **Mac**: `~/Library/Caches/CSXS/com.bepeel.leesin.motion*`
   - **Windows**: `%APPDATA%\Local\Temp\cep_cache\`
3. 按照安装说明重新安装

## 版本检测

LeeSinMotion 会在启动时自动检查更新：
- 如果有新版本，右下角版本号会显示橙色圆点 `● vX.X.X`
- 点击版本号会跳转到下载页面
- 会弹出提示通知新版本可用

## 常见问题

**Q: 更新后插件无法加载？**
A: 清理缓存后重启 AE，或重新运行 PlayerDebugMode 命令

**Q: 版本号没有更新？**
A: 确认是否完全替换了旧文件夹，而不是覆盖

**Q: 如何查看当前版本？**
A: 打开插件，右下角显示当前版本号

## 自动更新（未来计划）

目前 CEP 扩展不支持自动更新，需要手动替换文件。
我们正在探索更便捷的更新方案。
