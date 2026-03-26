# **LeeSin**Motion

<div align="center">
  <img src="docs/images/brand_logo.svg" width="128" alt="LeeSinMotion Logo" />
  <h3>Design to Code, The Missing Bridge.</h3>
  <p>补齐动画交付断层。一键将您的 After Effects 资产转化为像素级精准的可视化开发文档。</p>
  <p>
    <a href="https://leesin.bepeel.com/" target="_blank">官网 Website</a> |
    <a href="https://github.com/peelfig/LeeSinMotion/releases" target="_blank">下载安装包 Download</a>
  </p>
</div>

---

**LeeSinMotion** 是一款面向现代工作流的 After Effects 到代码 (Design to Code) 的底层桥梁。它彻底终结了“开发看不懂动画参数，设计对不齐缓动曲线”的协作痛点。

## ✨ 核心特性 (Features)

*   📊 **HTML 可视化导出**: 生成独立的 `timeline.html` 交互文档。包含毫秒级频率、延迟及完整的 **Cubic-Bezier** 贝塞尔曲线参数。
*   ⚡️ **Chromium 内核驱动**: 基于高性能原生 CEP 扩展架构，解析速度对比旧版脚本提升 **10 倍** 以上。
*   🖥 **全版本兼容**: 完美适配 **After Effects CC 2014 - 2025** 全系列，支持 macOS 与 Windows 双平台。
*   🎨 **工业级 UI**: 极致简约的高对比度界面，专为追求生产力的高级设计师打造。

---

## 🚀 安装指南 (Installation)

> [!IMPORTANT]
> **LeeSinMotion** 是高性能 **CEP 扩展插件**，而非传统 `.jsx` 脚本。

### 1. 下载并提取
从 [Releases](https://github.com/peelfig/LeeSinMotion/releases) 下载最新压缩包，解压后会得到 `com.bepeel.leesin.motion` 文件夹和 `安装说明_Installation.txt`。

### 2. 挂载至原生扩展目录
将整个 `com.bepeel.leesin.motion` 文件夹拷贝入下列系统级路径：

*   **macOS**: `/Library/Application Support/Adobe/CEP/extensions/`
*   **Windows**: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`

### 3. 一键提权 (首次安装必做)
由于是本地构建，需开启 Adobe 的调试模式以读取未签名插件。

#### **macOS (Terminal):**
拷贝并运行下列复合指令，一次性激活 2015-2025 全版本支持：
```bash
for i in {6..14}; do defaults write com.adobe.CSXS.$i PlayerDebugMode 1; done
```

#### **Windows (CMD):**
以**管理员身份**运行终端，执行下列指令：
```cmd
for /L %i in (6,1,14) do reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.%i" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

---

## 📖 使用指南 (Usage)

1.  **扫描关键帧**: 在 AE 中选中图层及其关键帧，点击 `获取参数 (Get Parameters)`。
2.  **导出交互文档**: 点击底部的 `Export Timeline HTML`，生成交互文档发给开发。
3.  **开发对接**: 开发人员打开网页即可直接复制 CSS 或缓动参数。

## 📂 项目结构 (Project Structure)

```text
LeeSinMotion/
├── extension/    # 🧩 插件核心代码 (Client/Host/Manifest)
├── website/      # 🌐 现代官网源码 (HTML/CSS/Vanilla JS)
├── docs/         # 📖 品牌资产与安装说明
├── scripts/      # 🛠 发布辅助与本地开发脚本
│   ├── check_version.sh    # 检查版本号一致性
│   ├── package_local.sh    # 本地打包测试
│   ├── build_extension.sh  # 构建扩展
│   └── sync_to_cep.sh      # 同步到本地 CEP 目录
└── README.md     # 🏠 项目入口文档
```

## 🛠 开发脚本 (Development Scripts)

```bash
# 检查版本号一致性
./scripts/check_version.sh

# 本地打包测试（模拟 GitHub Actions）
./scripts/package_local.sh

# 同步到本地 CEP 目录进行测试
./scripts/sync_to_cep.sh dev   # 开发版
./scripts/sync_to_cep.sh main  # 正式版
```

## ❤️ 致敬 (Credits)

原始概念来自 [Adam Plouff](http://www.battleaxe.co/) 和 Google Motion Design 团队的 [Inspector Spacetime](https://github.com/google/inspectorspacetime)。

v3.0 - v4.0 重型重构：**peelfig**

## 📄 协议 (License)

Apache 2.0 License - 继承自原项目 [Inspector Spacetime](https://github.com/google/inspectorspacetime)
