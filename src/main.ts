import "babel-polyfill";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

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
