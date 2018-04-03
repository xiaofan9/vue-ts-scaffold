<template>
  <div class="hello">
    <p>{{msg}}</p>
    <p>vuex 属性值：{{$store.state.test}}</p>
    <jsx-test></jsx-test>
  </div>
</template>

<script>
import jsxTest from "./jsx";
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '这里以下的整体是路由区域'
    }
  },
  components: {
    jsxTest
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
