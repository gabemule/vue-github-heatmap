import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VTooltip from 'v-tooltip';
import App from './App.vue';

Vue.use(VueAxios, axios);
Vue.use(VTooltip);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
