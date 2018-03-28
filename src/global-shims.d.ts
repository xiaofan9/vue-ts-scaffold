import lodash from "lodash";

// 全局变量设置
declare global {
  const _: typeof lodash;
}
