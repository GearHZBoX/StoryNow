import App from './App'
//  #ifdef APP
import Vuei18n from 'vue-i18n';
// #endif
import i18nConfig from './i18n/index.js';

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
// #ifdef APP
Vue.use(Vuei18n);
const i18n = new Vuei18n(i18nConfig);
// #endif
App.mpType = 'app'
const app = new Vue({
// #ifdef APP
  i18n,
// #endif
  ...App
})
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
import { createI18n } from 'vue-i18n';
const i18n = createI18n(i18nConfig)
export function createApp() {
  const app = createSSRApp(App);
  app.use(i18n);
  return {
    app
  };
};
// #endif