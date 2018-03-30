import lodash from "lodash";

// 全局声明全局变量
declare global {
  const _: typeof lodash;
  const process;
}

// 声明ele全局方法
declare module "vue/types/vue" {
  interface Vue {
    $Message: any;
  }
}
