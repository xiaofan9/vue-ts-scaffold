import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/module/home/components/HelloWorld";

describe("HelloWorld.vue", () => {
  it("should render correct contents", () => {
    const wrapper = shallowMount(HelloWorld);
    expect(wrapper.find("p").text()).to.equal("这里以下的整体是路由区域");
  });
});
