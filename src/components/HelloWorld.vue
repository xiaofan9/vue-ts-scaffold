<template>
  <div class="hello">
    <p class="unit">{{msg}}</p>
    <p>vuex 属性值：{{$store.getters.info.data}}</p>
    <p>mixin 数据 ：{{ testMixinArg }}</p>
    <RC></RC>
  </div>
</template>

<script lang="ts">
import RC from "./renderComponent.vue";
import TestMixin from "../mixins/test-mixin";
import { Getter } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";
@Component({
  components: {
    RC
  },
  mixins: [TestMixin]
})
export default class HelloWorld extends Vue {
  @Getter info;

  msg: string = "这里以下的整体是路由区域";

  mounted() {
    console.log("这是 _.assign({})", Object.assign({}));
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
