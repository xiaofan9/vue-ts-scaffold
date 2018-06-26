import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import HelloWorld from "@/components/HelloWorld";
import store from "@/store";
import { expect } from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("HelloWorld.vue", () => {
  // 测试前执行代码
  beforeEach(() => {
    console.time("测试用时");
  });

  it("should render correct contents", () => {
    const wrapper = shallowMount(HelloWorld, { store, localVue });

    expect(wrapper.find(".unit").text()).to.equal("这里以下的整体是路由区域");
  });

  // 测试后执行
  afterEach(() => {
    console.timeEnd("测试用时");
  });
});
