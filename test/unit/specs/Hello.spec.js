import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Home from "@/views/Home";
import store from "@/store";
import { expect } from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("Home.vue", () => {
  // 测试前执行代码
  beforeEach(() => {
    console.time("测试用时");
  });

  it("should render correct contents", () => {
    const wrapper = shallowMount(Home, { store, localVue });

    expect(wrapper.find(".unit").text()).to.equal("unit");
  });

  // 测试后执行
  afterEach(() => {
    console.timeEnd("测试用时");
  });
});
