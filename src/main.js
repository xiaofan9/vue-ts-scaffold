import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";

Vue.config.productionTip = false;

/* eslint-disable no-new */
const app = new Vue({
  el: "#app",
  data: { test: "1" },
  store,
  router,
  render: h => h(App)
});

export default app;
