<template>
  <div id="app">
    home
    <word></word>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import word from "./components/HelloWorld";

@Component({
  components: { word }
})
class App extends Vue {}
export default App;
</script>
