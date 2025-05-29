import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import { useConfigStore } from './store/configStore';
import setupElementPlus from './plugins/element';
import './assets/theme.css';

const app = createApp(App);
app.use(router);
app.use(pinia);
setupElementPlus(app);

// 初始化配置
const configStore = useConfigStore();
configStore.loadConfig();

app.mount('#app');
