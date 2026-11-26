# openchamber-pool-quota

将 **[Pool Status Board](https://github.com/In-dor/pool-status-board)**（Antigravity 4 窗口 + AIStudio2API 14 模型双号池只读看板，含 4 个 Nano Banana 画图模型及纯按次计额支持）无缝接入 **OpenChamber** 与 **OpenCode V2 终端 TUI** 的双端一体化插件，全程 **0 LLM Token 消耗、毫秒级响应**。

## 功能亮点

- **OpenChamber 一张原生总卡（`ext-pool-quota`）**：通过官方 `service.provides: ["quota"]` 接入，自动覆盖 **Settings → Usage 页面、Work Status 用量区、手机端右上角浮层（含桌面小组件）与桌面端系统托盘**；默认开启「紧凑配额文案（适配手机端）」避免窄屏叠字，也可在侧边栏面板按需切回详版。
- **可选开关显示 AIS 号池**：
  - **开启时**：总卡展示 Antigravity 4 窗口（剩余%、本轮已用 `$` / 满额预测 `$`、重置倒计时）+ AIStudio 汇总窗口 + 全部 14 个 AIStudio 模型分模型余量（含 4 个纯按次计额的 Nano Banana 画图模型，可在 Usage 页按需勾选置顶模型）。
  - **关闭时**：总卡瞬间精简为纯 Antigravity 4 窗口视图。
  - 在 OpenChamber 侧边栏 `Pool Quota` 面板、Work Status 区块，或 OpenCode TUI `/quota` 弹窗按 `a` 均可一键实时切换，配置双端互通。
- **Work Status 实时卡片 & 侧边栏面板（支持手机端）**：内置 `5h / 7d` 周期剩余趋势曲线、Antigravity 账号缓存命中率紧凑胶囊（按效率色阶展示，悬停/触控查看近 24h 命中率与约省费用，自动兼容旧版看板）、14 模型短板瓶颈 / 按次计额标识（自动折叠 100% 满血模型），以及看板地址 & 口令配置表单。
- **全端省流优化（保留 15s 实时体验）**：
  - 侧边栏面板集成三层可见性检测（`visibilityState` + 非零视口尺寸 + 顶层视口 `IntersectionObserver`），桌面端隐藏侧栏或手机端收起抽屉时完全暂停后台轮询，重新打开瞬间立即同步最新额度。
  - 扩展服务内置严格白名单 DTO 裁剪与 `?rev` / `?hrev` 增量同步协商：数据未变时仅回传约 `120 B` 轻量确认（零 DOM 重绘，原地刷新倒计时），历史曲线未变时跳过曲线点集重传并在前端实时同步虚线估算点。
  - 扩展服务、OpenCode Server 插件与 TUI 分别按需请求 `?view=compact` / `?view=tui` 并支持 `If-None-Match` → `304 Not Modified` 零正文复用，同时 100% 向后兼容未升级的旧版 Pool Status Board。
- **OpenCode V2 终端 TUI 原生支持**：
  - 底栏常驻实时简报（开启 AIS 且当前选中 AIS 模型时，自动高亮当前模型剩余%与可用号数）。
  - 零 Token 交互式 `/quota`（别名 `/pool`）面板：Antigravity 标题行自动轻量追加缓存命中率、24h 命中率与约省费用（旧版看板自动保持原样）；按 `a` 切换 AIS 显示、按 `r` 立即刷新、按 `s` 引导配置看板地址与访问口令。
  - 对话结束后静默检查，低于 20% 或可用号归零时自动弹低额度预警 Toast（15 分钟防抖）。
- **AI 可调用只读工具 `pool_quota`**：AI 需要评估余量或推荐切换模型时可直接调用（新版看板自动附带 Antigravity 缓存命中率与约省费用字段），平时 0 额外系统提示（仅在余量 `< 15%` 或核心模型可用号归零时注入极简 1 行提醒）。
- **口令安全**：访问口令仅保存在本机 `0600` 权限配置文件（`~/.config/opencode/pool-quota.json`）中，后端直连看板，绝不回显到前端或聊天流。

---

## 方式一：OpenChamber 一键安装（推荐）

适用于 **OpenChamber 2.7.1+**（Web / Electron 桌面端 / 手机端联动）。

1. 打开 OpenChamber → **Settings → Extensions**，点击添加 Git 仓库，填入：
   ```text
   https://github.com/In-dor/openchamber-pool-quota
   ```
2. 批准扩展所需的本地服务与插件权限（已预构建，**无需编译或 `npm install`**）。
3. 点击左侧栏 **Pool Quota** 图标，展开底部「连接设置」：
   - **看板地址 URL**：填你收到的看板地址（例如本机 `http://127.0.0.1:18380`，或反代域名 `https://your-board.example.com`）
   - **访问口令**：填看板口令（若未设口令可留空）
   - 点击 **测试并保存**。
4. 前往 **Settings → Usage → Pool Quota**，开启「在顶栏下拉中显示」，即可在顶栏、手机端与托盘随时瞄一眼额度；如需隐藏 AIStudio 号池，在侧边栏面板或 Work Status 中一键关闭「显示 AIStudio 号池」即可。

---

## 方式二：纯 OpenCode V2 终端 TUI 一键安装

适用于 **OpenCode v2.2+** 终端用户（无需安装 OpenChamber）。

1. 执行 CLI 命令一键添加（或在 `~/.config/opencode/opencode.jsonc` 的 `plugins` 中加入 `"github:In-dor/openchamber-pool-quota"`）：
   ```bash
   opencode plugin add github:In-dor/openchamber-pool-quota
   ```
   > 若仅需在本地 TUI 连接远端 OpenCode Server 时启用 TUI 面板，也可直接把 `"github:In-dor/openchamber-pool-quota"` 加入 `~/.config/opencode/cli.json` 的 `plugins` 数组。
2. 启动 `opencode`，输入 **`/quota`**（或 `/pool`）：
   - 按 **`s`**：输入看板地址 URL 与访问口令（测试通过后自动保存为 `0600` 文件）
   - 按 **`a`**：随时切换「显示 / 隐藏 AIStudio 号池」
   - 按 **`r`**：手动刷新最新快照
   - 底栏会自动常驻显示当前窗口/模型剩余额度。

---

## 配置文件与环境变量（可选）

双端共享配置文件 `~/.config/opencode/pool-quota.json`（权限 `0600`）：

```json
{
  "url": "http://127.0.0.1:18380",
  "passcode": "",
  "showAis": true,
  "compactQuota": true
}
```

也支持通过环境变量临时覆盖：`POOL_QUOTA_URL`、`POOL_QUOTA_PASSCODE`、`POOL_QUOTA_SHOW_AIS`、`POOL_QUOTA_COMPACT`（`true`/`false`）。

## 本地开发与构建

```bash
bun install
bun run typecheck
bun run bundle  # 构建 service/main.js 与 panel/main.js
bun run check   # 运行 OpenChamber 官方扩展校验
```

> 本仓库已提交预构建的 `service/main.js`、`panel/main.js` 及 `plugin/`，终端用户安装时无需构建。
