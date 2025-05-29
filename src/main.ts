import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import setupElementPlus from './plugins/element';
import './assets/theme.css';

const app = createApp(App);
app.use(router);
app.use(pinia);
setupElementPlus(app);
app.mount('#app');
