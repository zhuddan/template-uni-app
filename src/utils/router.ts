import { toRaw } from 'vue'
import { type App, unref } from 'vue'
import { setParams } from './helpers/params'

type ParamsType = object | string | number

type MaybeString<T> = T | string

/**
 * 封装路由跳转参数
 */
function getOptions<T extends object>(
  options: MaybeString<T>,
  params: ParamsType = {},
): T {
  let _params: Record<string, any> = {}
  if (typeof params == 'object') {
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key as keyof typeof params]
        if (value !== undefined) {
          const __query = toRaw(unref(value))
          _params[key] = JSON.stringify(__query)
        }
      }
    }
  }
  else {
    _params = {
      id: params,
    }
  }
  const result = typeof options == 'string'
    ? {
        url: setParams(options, _params),
      }
    : options
  return result as T
}

/**
 * 路由
 * 在 template 中可以使用 $router 访问
 * 在 setup 中请使用 useRouter hooks
 */
export class Router<T extends object = object> {
  private _query = {} as T
  private _path = ''
  get path() {
    return this._path
  }

  setPath(path: string) {
    this._path = path
  }

  setQuery(value: T) {
    this._query = value
  }

  get query() {
    return this._query
  }

  private _readyCallback: Array<(option: T) => void | any> = []

  init() {
    this._query = {} as T
    this._readyCallback = []
  }

  private navigateTo(
    option: MaybeString<UniNamespace.NavigateToOptions>,
    params?: ParamsType,
  ) {
    const navigateToOptions = getOptions(option, params)
    return uni.navigateTo({
      ...navigateToOptions,
    })
  }

  private redirectTo(
    option: MaybeString<UniNamespace.RedirectToOptions>,
    params?: ParamsType,
  ) {
    const redirectToOptions = getOptions(option, params)
    return uni.redirectTo({
      ...redirectToOptions,
    })
  }

  private navigateBack(options: UniNamespace.NavigateBackOptions = {}) {
    return uni.navigateBack(options)
  }

  /**
   * @description 路由跳转 等同于 uni.navigateTo
   * @param {string} option
   * @param params
   * @example
   * // 基础使用
   * router.push('/pages/xxx/xxx', { id:123, a:456 }) //=> uni.navigateTo({ url:'/pages/xxx/xxx?id=123&a=456' })
   *  // 如果只是一个参数 则视为 { id: 123} 此情况为了方便 useDataDetail 使用
   * router.push('/pages/xxx/xxx', 123) //=> uni.navigateTo({ url:'/pages/xxx/xxx?id=123' })
   */
  push(
    option: string,
    params?: ParamsType
  ): Promise<UniApp.NavigateToSuccessOptions>
  /**
   * @description 路由跳转 一个参数情况等同于 完全等同于 uni.navigateTo
   * @param {UniNamespace.NavigateToOptions} option
   * @example
   *  router.push({ url: './home' })
   */
  push(
    option: UniNamespace.NavigateToOptions
  ): Promise<UniApp.NavigateToSuccessOptions>
  push(
    option: MaybeString<UniNamespace.NavigateToOptions>,
    params: ParamsType = {},
  ) {
    return this.navigateTo(option, params)
  }

  /**
   * 重定向 参数参考 router.push
   * @param option
   * @param params
   */
  replace(option: string, params?: ParamsType): Promise<any>
  /**
   * 重定向 参数参考 router.push
   * @param option
   * @param params
   */
  replace(option: UniNamespace.RedirectToOptions): Promise<any>
  replace(
    option: MaybeString<UniNamespace.RedirectToOptions>,
    params: ParamsType = {},
  ) {
    return this.redirectTo(option, params)
  }

  /**
   * 路由返回 完全等同于 uni.navigateBack
   * @param option
   */
  back(option?: UniNamespace.NavigateBackOptions) {
    return this.navigateBack(option)
  }

  /**
   * 切换 tabbar页面 完全等同于 uni.switchTab
   * @param option 单字符串参数等同于 url
   */
  switchTab(option: MaybeString<UniNamespace.SwitchTabOptions>) {
    const switchTabOptions = getOptions(option)
    return uni.switchTab({
      ...switchTabOptions,
    })
  }

  install(app: App) {
    app.config.globalProperties.$router = this as unknown as Router<object>
    return app
  }

  ready(cb?: (option: T) => void) {
    cb && this._readyCallback.push(cb)
  }

  runReady(option: T) {
    this._readyCallback.forEach((cb) => {
      cb(JSON.parse(JSON.stringify(option)))
    })
  }

  getCurrentPage() {
    const currentPages = getCurrentPages()
    const page = currentPages?.[currentPages.length - 1] || null
    return page
  }

  getLastPage() {
    const currentPages = getCurrentPages()
    const page = currentPages?.[currentPages.length - 2] || null
    return page
  }
}
