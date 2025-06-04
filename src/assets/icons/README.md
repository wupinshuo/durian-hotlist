# 图标系统

本项目使用了统一的图标管理系统，方便开发者在整个应用中使用一致的图标。

## 图标列表

当前支持的图标：

- `bilibili` - B站LOGO图标
- `bilibili-up` - B站UP主图标
- `bilibili-play` - B站播放量图标
- `weibo` - 微博LOGO图标
- `weibo-hot` - 微博热度图标
- `juejin` - 掘金LOGO图标
- `juejin-hot` - 掘金热度图标
- `sspai` - 少数派LOGO图标

## 使用方式

### 方式一：使用 AppIcon 组件（推荐）

```vue
<template>
  <AppIcon name="bilibili" />
  <AppIcon name="weibo" color="weibo" size="lg" />
  <AppIcon name="juejin" color="primary" />
</template>

<script setup>
import { AppIcon } from '@/components';
</script>
```

支持属性：
- `name` - 图标名称
- `color` - 颜色，可选值：primary, success, warning, danger, info，或者平台特定颜色如 bilibili, weibo, juejin
- `size` - 大小，可选值：xs, sm, md, lg, xl

### 方式二：直接导入组件

```vue
<template>
  <component :is="BilibiliIcon" />
</template>

<script setup>
import { BilibiliIcon } from '@/assets/icons';
</script>
```

### 方式三：使用原始SVG

```vue
<template>
  <span v-html="BilibiliSVGRaw"></span>
</template>

<script setup>
import { BilibiliSVGRaw } from '@/assets/icons';
</script>
```

## 添加新图标

如需添加新图标，请遵循以下步骤：

1. 将SVG文件放入 `src/assets/icons` 目录
2. 在 `src/assets/icons/index.ts` 文件中导入并导出图标
3. 更新图标类型 `IconType` 定义
4. 在 `src/components/AppIcon.vue` 的 `iconMap` 中添加图标映射

## 图标规范

- SVG图标应该保持简洁，去除不必要的属性
- 图标命名格式：`平台名-功能.svg`，例如 `bilibili-play.svg`
- 平台主图标直接使用平台名，例如 `bilibili.svg` 