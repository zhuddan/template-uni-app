export {}

declare module 'vue' {
  type Compositions = App.AppInstance & Page.PageInstance
  interface ComponentCustomOptions extends Compositions {}
}
