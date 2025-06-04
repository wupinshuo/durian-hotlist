import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import setupElementPlus from './plugins/element';
import './styles/index.css'; // 这里已经包含了所有主题样式
import { initTheme } from './styles/theme-utils';

const app = createApp(App);
app.use(router);
app.use(pinia);
setupElementPlus(app);

// 初始化主题
initTheme();

app.mount('#app');
