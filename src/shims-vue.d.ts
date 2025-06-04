/* Vue组件声明 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
}
