// eslint-disable-next-line ts/no-wrapper-object-types, unused-imports/no-unused-vars
export interface PageKey<T> extends Symbol { }

export type PageIdentifier<T = AnyObject> = PageKey<T> | string | number

export const maps = new Map<PageIdentifier<any>, AnyObject>()
/**
 * app 和 H5 端 defineExpose 无效
 * @param key
 * @param expose
 */
export function usePageExpose<T extends AnyObject>(key: PageIdentifier<T>, expose: T) {
  onMounted(() => {
    maps.set(key, expose)
    console.log('Registered', key)
  })

  onUnmounted(() => {
    console.log('Unregistered', key)
    maps.delete(key)
  })

  return {} as T
}

export function getPageExpose<T extends AnyObject>(key: PageIdentifier<T>) {
  return (maps.get(key) || {}) as Partial<T>
}
