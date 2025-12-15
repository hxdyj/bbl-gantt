# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概述

`bbl-gantt` 是一个框架无关的基于 SVG 的甘特图库。该库发布到 npm，支持 Normal 模式（基于日期）和 Duration 模式（基于经过时间）两种甘特图。

## 构建命令

```bash
# 启动演示的开发服务器
pnpm dev

# 构建库（用于发布到 npm）
pnpm build

# 构建演示站点
pnpm build-demo

# 构建文档站点
pnpm docs:build

# 同时构建演示和文档
pnpm build-web

# 预览生产构建
pnpm preview

# 启动文档开发服务器
pnpm docs:dev

# 预览文档
pnpm docs:preview
```

## 架构

### 源代码组织

- **`package/`** - 主库源代码（发布到 npm 的内容）
  - `index.ts` - 主入口文件，导出 `Gantt` 类和所有类型
  - `view.ts` - View 类，用于滚动操作和视口计算
  - `time.ts` - Time 类，用于刻度计算、时间与位置转换
  - `render.ts` - 主渲染协调器
  - `render/` - 甘特图不同部分的渲染模块
    - `eventItem/` - 事件项渲染和样式
    - `headerRender.ts`, `rowsRender.ts`, `ticksRender.ts`, `eventsRender.ts` - 专门的渲染器
  - `event/` - 事件处理和绑定工具
  - `utils/` - 时间、数据处理和 DOM 操作的工具函数
  - `const/` - 常量和 CSS 类名

- **`src/`** - 演示应用源代码（基于 React，不属于库的一部分）

- **`docs/`** - VitePress 文档站点

- **`types/`** - 生成的 TypeScript 声明文件（输出目录）

- **`dist/`** - 构建后的库文件（输出目录）

### 核心架构

该库围绕四个主要类构建：

1. **`Gantt`** (package/index.ts) - 主类，协调所有内容。创建和管理：
   - 容器 DOM 元素
   - 使用 `@svgdotjs/svg.js` 的 SVG stage
   - 用于内部通信的 EventBus
   - View、Time 和 Render 实例

2. **`View`** (package/view.ts) - 处理视口操作：
   - 滚动到事件/项/ID 的功能
   - 点在框内的计算，用于视口可见性判断

3. **`Time`** (package/time.ts) - 管理时间计算：
   - 像素与时间之间的转换（x2time, time2x）
   - 基于列配置计算刻度
   - 跟踪可见刻度范围以优化性能
   - 支持 Normal 模式（绝对日期）和 Duration 模式（经过时间）

4. **`Render`** (package/render.ts) - 协调渲染：
   - 委托给专门的渲染器（header、rows、ticks、events）
   - 使用 PartRender 基类模式进行模块化渲染

### 核心概念

- **两种模式**：
  - `GanttMode.Normal` - 使用绝对日期（例如：2024-01-01）
  - `GanttMode.Duration` - 使用从起点开始的经过时间（例如：00:05:30）

- **数据结构**：
  - `GanttItem[]` - 包含事件的行
  - 每个项有 `id`、`name`、`events[]` 和可选的 `children[]`
  - 事件有 `id`、`start`、`end`、`name` 和可选的 `shape`、`color`

- **列配置**：
  - `column.width` - 每列的像素宽度
  - `column.timeMetric` - 每列代表的时间长度（TimeMetric 枚举或毫秒数）
  - `column.padding` - 左右两侧的空白列用于填充

- **刻度**：计算两种类型的刻度：
  - 基于 `column.timeMetric` 的用户自定义刻度
  - 用于头部显示的基于时间的刻度（自动确定）

## 构建系统

- **库构建**：使用 `vite.lib.config.ts`，配置如下：
  - 入口：`package/index.ts`
  - 输出：UMD 和 ES 模块到 `dist/`
  - 类型：通过 `vite-plugin-dts` 生成到 `types/`
  - 禁用压缩（`minify: false`）
  - 使用 `@rollup/plugin-strip` 移除 console/debug 语句

- **演示构建**：使用 `vite.config.ts` 构建 React 演示应用

- **文档**：基于 VitePress，支持中文和英文

## 依赖项

核心运行时依赖：
- `@svgdotjs/svg.js` - SVG 操作
- `dayjs` - 日期/时间处理（包含插件：duration, minMax, weekOfYear, isBetween）
- `eventemitter3` - 事件总线
- `hotkeys-js` - 键盘快捷键
- `uid` - 唯一 ID 生成

## 测试

测试文件位于 `test/` 目录，包含用于手动测试 UMD 和 ESM 构建的 HTML 文件。

## 包入口点

- `main`: `./dist/index.umd.js` (UMD 格式)
- `module`: `./dist/index.es.js` (ES 模块)
- `types`: `./types/package/index.d.ts` (TypeScript 声明)
