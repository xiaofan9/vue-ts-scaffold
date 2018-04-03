import Vue from "vue";
import Vuex from "vuex";

import user from "./modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    a: 1,
    test: "a"
  }
});

export default store;
