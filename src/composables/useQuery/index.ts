import type { Ref } from 'vue'

import { onLoad } from '@dcloudio/uni-app'
import { ref, toRaw, unref } from 'vue'
import { isJSONString, logger, mergeDeep } from '@/utils/index'

function parse(value: any): any {
  if (typeof value == 'string' && isJSONString(value)) {
    value = JSON.parse(value)
    return parse(value)
  }
  return value
}

/**
 * 获取当前页面 url 参数
 * 建议使用 const router = useRouter() 获取
 * @param defaultValue
 */
export function useQuery<T extends object = object>(defaultValue: T = {} as T, debugMsg = true) {
  // defaultValue 仅在 dev 环境下生效
  const query = ref<T>(__DEV__ ? defaultValue : {} as T) as Ref<T>
  onLoad((_query) => {
    if (!_query)
      return
    // if (__DEV__) {
    //   console.log('<query>');
    //   console.log(JSON.stringify(_query));
    // }
    if (Object.keys(_query).length) {
      const data = getJson(_query)
      query.value = toRaw(unref(mergeDeep({ ...query.value }, { ...data })))
    }

    if (debugMsg) {
      if (Object.keys(toRaw(unref(query))).length) {
        const route = getCurrentPages()?.[getCurrentPages().length - 1].route
        logger.info(`[useQuery] ${route}`)
        const data = JSON.parse(JSON.stringify(toRaw(unref(query))))
        console.log(data)
      }
    }
  })
  return query
}

function getJson(_query: object) {
  const data: Record<string, any> = {}
  for (const key in _query) {
    if (Object.prototype.hasOwnProperty.call(_query, key)) {
      const value = decodeURIComponent(decodeURIComponent(_query[key as keyof typeof _query]))
      // const value = _value.replace(/^\"{/g, '{').replace(/}\"$/g, '}');
      // let jsonStringWithUnicodeReplaced = value.replace(/\\u([\d\w]{4})/g, (match, grp) => String.fromCharCode(parseInt(grp, 16)));

      // // 替换转义双引号
      // jsonStringWithUnicodeReplaced = jsonStringWithUnicodeReplaced.replace(/\\"/g, '"');
      if (isJSONString(value)) {
        data[key] = parse(value)
      }
      else {
        data[key] = value
      }
    }
  }
  return data
}
