import { Vue, Component } from "vue-property-decorator";

/**
 * Mixin test
 *
 * @export
 * @class TestMixin
 * @extends {Vue}
 */
@Component({})
export default class TestMixin extends Vue {
  testMixinArg = "this is test mixin arg";

  testMixinFunc() {
    console.log("this string is from test mixin console.log");
  }
}
