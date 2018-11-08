import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

import "./registerServiceWorker";

Vue.config.productionTip = false;

/* eslint-disable no-new */
const app = new Vue({
  el: "#app",
  router,
  components: {
    App
  },
  render: h => h(App),
  store
});

export default app;
