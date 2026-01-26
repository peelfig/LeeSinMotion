# LeeSin Motion - 动效标注大杀器

动效标注是开发过程中必不可少的一环，但手动整理关键帧数据往往繁琐且耗时。**LeeSin Motion** 彻底重塑了这一流程，让设计师只需一键即可生成精准的动效参数，实现设计与工程的完美对接。

[官网地址](https://leesin.peelg.com/) | [GitHub 开源地址](https://github.com/peelfig/LeeSinMotion)

---

## ✨ 核心特性

- **⚡️ 即时标注 (Instant Specs)**：选中任意两个关键帧，即刻获取时长、延迟和数值变化，告别手动计算。
- **🎯 精准数据 (Precision Data)**：导出数值、差值变化以及标准的贝塞尔曲线（Cubic-bezier），完美适配 CSS、Web、iOS 或 Android 开发。
- **⏱ 时间感知 (Time Awareness)**：独有的“获取单个键时间”功能，让您精确锁定动画事件在时间轴上的发生瞬间。
- **📝 格式灵活 (Format Flexibility)**：支持导出为 Markdown（文档）、JSON（代码）或纯文本，方便分享到 Jira、Notion、飞书或 Slack。

---

## 🚀 安装说明

### macOS
将 `LeeSinMotion.jsx` 拷贝到 AE 脚本 UI 目录：
`/应用程序/Adobe After Effects CC 2025/Scripts/Script UI Panels`

### Windows
将 `LeeSinMotion.jsx` 拷贝到 AE 脚本 UI 目录：
`C:\Program Files\Adobe\Adobe After Effects CC 2025\Support Files\Scripts\ScriptUI Panels`

*安装完成后，重启 After Effects，在“窗口”菜单最下方即可找到 LeeSin Motion。*

---

## 📖 使用指南

1. **选中关键帧**：在 AE 时间轴中选中一组或多组关键帧。
2. **获取参数**：点击插件中的“从选定的关键帧获取参数”按钮。
3. **复制分享**：在 Text、MD 或 JSON 面板中复制数据，直接分发给开发同事。

---

## ❤️ 致敬与传承

这个项目最初由动效界的大神 **[Adam Plouff](http://www.battleaxe.co/)** (BattleAxe 创始人) 开发（原名 Inspector Spacetime）。他为 AE 社区带来了极其优雅的工作流。

**peelfig (v3.0) 增强版：**
- **全界面中文化**：更符合国内设计师的使用习惯。
- **功能增强**：加入了“单帧时间获取”等实用功能。
- **UI 优化**：适配最新的 AE 版本和现代审美。

感谢 Adam 的开源精神，我们在此基础上继续进化。

---

## 📄 开源协议

基于 [Apache 2.0](LICENSE.md) 协议开源。
