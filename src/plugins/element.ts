import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import { App } from "vue";

export default (app: App) => {
  app.use(ElementPlus, {
    locale: zhCn,
  });
};
