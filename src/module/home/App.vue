<template>
  <div id="app">
    home
    <word></word>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import word from "./components/HelloWorld";

@Component({
  components: { word }
})
class App extends Vue {
  @Prop()
  A;
}
export default App;
</script>
