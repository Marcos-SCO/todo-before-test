import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';

// import './style.css';
import App from './App.vue';

import './assets/main.css';

// font awesome imports
import '@fortawesome/fontawesome-free/css/all.min.css';

// Vue toastify imports
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
});

app.use(createPinia());
app.use(router);
app.mount('#app');