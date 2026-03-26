# 自动发布流程说明

## 发布方式

当前项目使用 **GitHub Actions 手动触发发布**。

日常更新 `main` 分支**不会自动发版**。
只有在 GitHub Actions 页面手动运行 `Release` workflow，并输入版本号后，才会执行：

1. 校验版本号格式
2. 检查对应 tag 是否已存在
3. 构建 CEP 安装包
4. 创建 tag
5. 创建 GitHub Release
6. 上传 zip 安装包

---

## 发布新版本的步骤

### 1. 完成功能并合并到 main
正常开发、测试并把代码合并到 `main`。

### 2. 打开 GitHub Actions
进入仓库的 **Actions** 页面，找到 `Release` workflow。

### 3. 手动运行发布
点击 **Run workflow**，输入版本号，例如：

```text
4.0.2
```

### 4. 自动发布内容
workflow 会自动：
- 创建 tag：`v4.0.2`
- 打包 `LeeSinMotion_v4.0.2.zip`
- 创建 GitHub Release
- 上传安装包到 Release Assets

---

## 安装包结构

Release 中上传的 zip 结构如下：

```text
LeeSinMotion_vX.Y.Z.zip
├── com.bepeel.leesin.motion/
│   ├── CSXS/manifest.xml
│   ├── client/
│   ├── host/
│   └── package.json
└── 安装说明_Installation.txt
```

---

## 版本号规则

版本号格式必须为三段式：

```text
主版本.次版本.修订号
```

例如：
- `4.0.1`
- `4.1.0`
- `5.0.0`

如果 tag 已存在，workflow 会自动跳过，不会重复发布。

---

## 注意事项

1. `main` 分支更新不会自动发布
2. 发布必须在 Actions 页面手动触发
3. 输入的版本号将直接作为 tag 和 Release 版本号
4. 发布前请先确认代码已经是准备发版的状态

---

## 故障排查

### workflow 失败
- 检查输入版本号是否符合 `x.y.z` 格式
- 检查 tag 是否已经存在
- 检查 Actions 日志中的构建输出

### Release 没生成
- 确认 workflow 已成功执行完成
- 确认仓库有 `contents: write` 权限
- 确认 `softprops/action-gh-release` 步骤没有失败
