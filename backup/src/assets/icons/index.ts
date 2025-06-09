import { h } from 'vue';

// 导入 SVG 图标
import BilibiliSVG from './bilibili.svg?raw';
import BilibiliUpSVG from './bilibili-up.svg?raw';
import BilibiliPlaySVG from './bilibili-play.svg?raw';
import WeiboSVG from './weibo.svg?raw';
import WeiboHotSVG from './weibo-hot.svg?raw';
import JuejinSVG from './juejin.svg?raw';
import JuejinHotSVG from './juejin-hot.svg?raw';
import SspaiSVG from './sspai.svg?raw';

// 原始SVG内容导出
export const BilibiliSVGRaw = BilibiliSVG;
export const BilibiliUpSVGRaw = BilibiliUpSVG;
export const BilibiliPlaySVGRaw = BilibiliPlaySVG;
export const WeiboSVGRaw = WeiboSVG;
export const WeiboHotSVGRaw = WeiboHotSVG;
export const JuejinSVGRaw = JuejinSVG;
export const JuejinHotSVGRaw = JuejinHotSVG;
export const SspaiSVGRaw = SspaiSVG;

// 创建自定义渲染函数，将原始SVG字符串转换为Vue组件
export const createSvgIconComponent = (svgString: string) => {
  return () =>
    h('span', {
      class: 'svg-icon',
      innerHTML: svgString,
    });
};

// 导出图标组件
export const BilibiliIcon = createSvgIconComponent(BilibiliSVG);
export const BilibiliUpIcon = createSvgIconComponent(BilibiliUpSVG);
export const BilibiliPlayIcon = createSvgIconComponent(BilibiliPlaySVG);
export const WeiboIcon = createSvgIconComponent(WeiboSVG);
export const WeiboHotIcon = createSvgIconComponent(WeiboHotSVG);
export const JuejinIcon = createSvgIconComponent(JuejinSVG);
export const JuejinHotIcon = createSvgIconComponent(JuejinHotSVG);
export const SspaiIcon = createSvgIconComponent(SspaiSVG);

// 图标类型定义
export type IconType =
  | 'bilibili'
  | 'bilibili-up'
  | 'bilibili-play'
  | 'weibo'
  | 'weibo-hot'
  | 'juejin'
  | 'juejin-hot'
  | 'sspai';
