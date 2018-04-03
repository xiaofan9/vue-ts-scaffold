import "babel-polyfill";

import Vue from "vue";
import App from "./App.1.vue";
import router from "./router/index.ts";
import store from "./store/index.ts";

Vue.config.productionTip = false;

/* eslint-disable no-new */
const init = new Vue({
  el: "#app",
  data: { test: "1" },
  store,
  router,
  render: h => h(App)
});

window["env"] = process.env.NODE_ENV;
