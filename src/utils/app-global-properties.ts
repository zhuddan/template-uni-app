import type { App } from 'vue'

/**
 * app 全局属性 包括样式颜色 (COLOR) 请求地址 静态资源地址等
 *
 */
export const appGlobalProperties = {

  install(app: App) {
    app.config.globalProperties.API_URL = API_URL
    app.config.globalProperties.APP_TITLE = APP_TITLE

    return app
  },
}
