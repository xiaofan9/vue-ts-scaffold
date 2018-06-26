// 在代码中导入 *.vue 文件的时候，需要写上 .vue 后缀。原因还是因为 TypeScript 默认只识别 *.ts 文件，不识别 *.vue 文件
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
