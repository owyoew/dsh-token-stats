# dsh-token-stats

DSH（DeepSeek Harness）Web 界面的每日 token 消耗统计插件，类似 Claude Code 的 `/cost` 与 Codex CLI 的用量统计。

## 功能

- **Web 设置页**：打开设置（侧栏齿轮）→「Token 用量」：
  - **周柱状图**：近 30 天按周分组（周一起始），每天一列，按模型分色（蓝色系，同模型颜色恒定），没有使用的天留空；
  - **30 天点状图**：按周对齐的日历点阵，颜色越深用量越多（不区分模型），今日描边；
  - KPI：今日 / 昨日 / 累计消耗、会话数；
  - 每日明细表：总量、输入、输出、缓存、会话数；
  - **估算费用**（最底部）：今日 / 累计，按 DeepSeek 官网低谷（闲时）价、2026-08-17 调价后：
    - `deepseek-v4-flash`：缓存命中 0.05 元 / 未命中 1.5 元 / 输出 4.5 元（每百万 tokens）
    - `deepseek-v4-pro`：缓存命中 0.15 元 / 未命中 4.5 元 / 输出 13.5 元（每百万 tokens）
    - 缓存写入按未命中输入计（官网表无单独列，估算略保守）；未收录模型不计费
  - 刷新按钮 + 生成时间。
- **JSON API**：`GET /api/token-stats`（仅供设置页使用，含 `totals.cost` / `todayCost` / `pricing`）。

## 统计口径

- 数据来源：每个会话日志（`$DSH_HOME/sessions/**/session.jsonl.zstd`）里提供方报告的 usage 记录 + 内存中的活跃会话。
- 按「(轮次, 步骤)」去重：同一步骤的多次 usage 样本只取最后一次（与内置 token-meter 语义一致）。
- 按事件时间归属到**服务器本地时区**的日历日。
- 模型 / 提供方取自该样本之前最近的 `request/header`。

## 性能

- **请求永不等待日志 I/O**：插件激活时后台预热折叠缓存；每次请求直接返回内存中的缓存视图，数据有变化时在后台（防抖 2s）增量刷新。
- **增量折叠**：活跃会话只折叠内存中新增的事件尾巴；冷会话文件仅在 size/mtime 变化时重读，否则零磁盘 I/O。
- **不阻塞事件循环**：冷读的解压与解析都分块让出事件循环（实测 Node 的 async zstd 实际仍占主线程，故用同步解压 + 分块让步）。
- 实测（38+ 会话、日志持续增长）：连续请求全部 15~31ms，后台冷读刷新期间也不卡顿；冷读取只解析与用量相关的行。
- 客户端刷新时保留旧数据展示，不闪「统计中…」。

## 安装位置

- 插件源码：`C:\Users\~\Desktop\dsh\dsh-token-stats\`
- 加载器入口：`C:\Users\~\.dsh\profiles\web\node_modules\@dsh-local\token-stats`（junction → 源码目录）
- Profile 补丁：`C:\Users\~\.dsh\profiles\web\cordis.patch.yml` 中的 `token-stats` 行

## 修改后生效

改动插件源码或补丁后，需要重启 `dsh web` 才会生效：

```sh
# 在原来的终端里 Ctrl+C 停止，然后重新启动
dsh web
# 或者
npx @deepseek-ai/dsh web
```

## 本地测试

```sh
node test-token-stats.mjs        # 用真实 session 日志跑一遍聚合，打印每日/每模型明细
node test-token-stats-perf.mjs   # 增量折叠等价性 + 冷/热路径性能测试
node test-token-stats-cost.mjs   # 费用估算数学校验
node test-client-render.mjs      # 客户端设置区块渲染结构测试
```
