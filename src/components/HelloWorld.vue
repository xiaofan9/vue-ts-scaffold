<template>
  <div class="hello">
    <p class="unit">{{msg}}</p>
    <p>vuex 属性值：{{test}}</p>
    <jsx-test></jsx-test>
  </div>
</template>

<script>
import jsxTest from "./jsx";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "unit",
      test: this.$store.state.test
    };
  },
  components: {
    jsxTest
  }
};
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
